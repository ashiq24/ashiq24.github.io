#!/usr/bin/env python3
import os
import re
import shutil
import yaml

ROOT = os.path.dirname(os.path.abspath(__file__))

def load_yaml(filename):
    path = os.path.join(ROOT, '_data', filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    return {}

def resolve_var(path, local_ctx, global_ctx):
    path = path.strip()
    if (path.startswith("'") and path.endswith("'")) or (path.startswith('"') and path.endswith('"')):
        return path[1:-1]
        
    parts = path.split('.')
    if parts[0] in local_ctx:
        cur = local_ctx[parts[0]]
        for p in parts[1:]:
            if isinstance(cur, dict) and p in cur:
                cur = cur[p]
            else:
                return None
        return cur
        
    cur = global_ctx
    for p in parts:
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        else:
            return None
    return cur

def eval_cond(cond_str, local_ctx, global_ctx):
    cond_str = cond_str.strip()
    if '==' in cond_str:
        left, right = cond_str.split('==', 1)
        l_val = resolve_var(left, local_ctx, global_ctx)
        r_val = resolve_var(right, local_ctx, global_ctx)
        return str(l_val if l_val is not None else '') == str(r_val if r_val is not None else '')
    elif '!=' in cond_str:
        left, right = cond_str.split('!=', 1)
        l_val = resolve_var(left, local_ctx, global_ctx)
        r_val = resolve_var(right, local_ctx, global_ctx)
        return str(l_val if l_val is not None else '') != str(r_val if r_val is not None else '')
    else:
        val = resolve_var(cond_str, local_ctx, global_ctx)
        return bool(val)

def process_template(template_str, local_ctx, global_ctx):
    # 1. Resolve includes
    for _ in range(3):
        def replace_include(match):
            inc_path = match.group(1).strip()
            full_inc_path = os.path.join(ROOT, inc_path)
            if os.path.exists(full_inc_path):
                with open(full_inc_path, 'r', encoding='utf-8') as f:
                    return f.read()
            return ''
        template_str = re.sub(r'\{%\s*include_relative\s+([^\s%]+)\s*%\}', replace_include, template_str)

    # 2. Process For Loops {% for item in path %} ... {% endfor %}
    for_pattern = r'\{%\s*for\s+([^\s]+)\s+in\s+([^\s%]+)\s*%\}(.*?)\{%\s*endfor\s*%\}'
    def replace_for(match):
        item_var = match.group(1).strip()
        data_path = match.group(2).strip()
        body = match.group(3)
        
        items = resolve_var(data_path, local_ctx, global_ctx)
        if not items or not isinstance(items, list):
            return ''
        
        rendered_items = []
        for item in items:
            new_local = dict(local_ctx)
            new_local[item_var] = item
            rendered_items.append(process_template(body, new_local, global_ctx))
        return ''.join(rendered_items)

    template_str = re.sub(for_pattern, replace_for, template_str, flags=re.DOTALL)

    # 3. Process If / Elsif / Else / Endif blocks
    if_block_pattern = r'\{%\s*if\s+(.*?)\s*%\}(.*?)\{%\s*endif\s*%\}'
    def replace_if_block(match):
        cond_expr = match.group(1)
        inner_content = match.group(2)
        
        # Split inner_content by {% elsif ... %} and {% else %}
        branches = []
        tokens = re.split(r'(\{%\s*(?:elsif|else).*?%\})', inner_content, flags=re.DOTALL)
        
        cur_cond = cond_expr
        cur_body = tokens[0]
        branches.append((cur_cond, cur_body))
        
        i = 1
        while i < len(tokens):
            tag = tokens[i]
            body = tokens[i+1] if i+1 < len(tokens) else ''
            i += 2
            
            elsif_match = re.match(r'\{%\s*elsif\s+(.*?)\s*%\}', tag, re.DOTALL)
            if elsif_match:
                branches.append((elsif_match.group(1), body))
            else:
                # else tag
                branches.append(('TRUE', body))
                
        for cond, body in branches:
            if cond == 'TRUE' or eval_cond(cond, local_ctx, global_ctx):
                return process_template(body, local_ctx, global_ctx)
        return ''

    template_str = re.sub(if_block_pattern, replace_if_block, template_str, flags=re.DOTALL)

    # 4. Process Variables {{ var }}
    var_pattern = r'\{\{\s*([^\}]+)\s*\}\}'
    def replace_var_tag(match):
        var_path = match.group(1).strip()
        val = resolve_var(var_path, local_ctx, global_ctx)
        if val is not None:
            return str(val)
        return ''

    template_str = re.sub(var_pattern, replace_var_tag, template_str)
    return template_str

def build():
    context = {
        'site': {
            'title': 'Md Ashiqur Rahman',
            'info': 'phd cs @ Purdue',
            'url': '.',
            'og_image': 'assets/img/profile_pic_3.jpeg',
            'icon-pic': 'assets/img/mandu_icon.png',
            'data': {}
        },
        'page': {
            'url': '/index.html'
        }
    }

    data_dir = os.path.join(ROOT, '_data')
    for f in os.listdir(data_dir):
        if f.endswith('.yaml') or f.endswith('.yml'):
            key = os.path.splitext(f)[0]
            context['site']['data'][key] = load_yaml(f)

    sections = ['about', 'affiliations', 'updates', 'research', 'outreach', 'resources', 'gallery', 'footer']
    rendered_sections = {}
    for sec in sections:
        sec_path = os.path.join(ROOT, '_sections', f'{sec}.html')
        if os.path.exists(sec_path):
            with open(sec_path, 'r', encoding='utf-8') as f:
                content = f.read()
                rendered_sections[sec] = process_template(content, {}, context)
        else:
            rendered_sections[sec] = ''

    content_body = f"""
{rendered_sections['about']}
<hr class="my-1">
<div class="row">
    <div class="col-md-6" id="affiliations">
        {rendered_sections['affiliations']}
    </div>
    <div class="col-md-6" id="updates">
        {rendered_sections['updates']}
    </div>
</div>
{rendered_sections['research']}
{rendered_sections['outreach']}
{rendered_sections['resources']}
{rendered_sections['gallery']}
{rendered_sections['footer']}
"""

    layout_path = os.path.join(ROOT, '_layouts', 'main.html')
    with open(layout_path, 'r', encoding='utf-8') as f:
        layout = f.read()

    global_ctx_with_content = dict(context)
    global_ctx_with_content['content'] = content_body

    final_output = process_template(layout, {}, global_ctx_with_content)

    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(final_output)

    site_dir = os.path.join(ROOT, '_site')
    os.makedirs(site_dir, exist_ok=True)
    with open(os.path.join(site_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(final_output)

    # Keep the static preview in sync with assets used by the page.
    for folder_name in ('assets', 'js', 'styles'):
        source_dir = os.path.join(ROOT, folder_name)
        target_dir = os.path.join(site_dir, folder_name)
        if os.path.exists(source_dir):
            shutil.copytree(source_dir, target_dir, dirs_exist_ok=True)

    print("Full Liquid template rendering completed!")

if __name__ == '__main__':
    build()
