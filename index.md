---
layout: main
---

{% include_relative _sections/about.html %}
<hr class="my-1">
<div class="row">
    <div class="col-md-6" id="affiliations">
        {% include_relative _sections/affiliations.html %}
    </div>
    <div class="col-md-6" id="updates">
        {% include_relative _sections/updates.html %}
    </div>
</div>
{% include_relative _sections/research.html %}
{% include_relative _sections/outreach.html %}
{% include_relative _sections/resources.html %}
{% include_relative _sections/gallery.html %}
{% include_relative _sections/footer.html %}
