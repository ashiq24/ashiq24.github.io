# HuggingFace Resources Support

Your website now supports displaying both GitHub repositories and HuggingFace datasets/models in the Resources section!

## How to Add HuggingFace Resources

### For Datasets:

In `_data/resources.yaml`, add entries like this:

```yaml
- type: huggingface
  hf-type: dataset
  hf-id: your-username/dataset-name
  category: research  # or 'open-source' or 'miscellaneous'
```

### For Models:

```yaml
- type: huggingface
  hf-type: model
  hf-id: your-username/model-name
  category: research
```

## Example

```yaml
links:
  # GitHub repository
  - type: github
    git-api: https://api.github.com/repos/ashiq24/UNO
    category: research
  
  # HuggingFace dataset
  - type: huggingface
    hf-type: dataset
    hf-id: ashiq24/my-awesome-dataset
    category: research
  
  # HuggingFace model
  - type: huggingface
    hf-type: model
    hf-id: ashiq24/my-awesome-model
    category: research
```

## What Gets Displayed

### GitHub Cards Show:
- Repository name
- Description
- Programming language
- Star count
- Fork count

### HuggingFace Cards Show:
- Dataset/Model name
- Description
- Type (dataset or model)
- Download count
- Likes count
- HuggingFace icon

## Categories

You can organize resources into categories:
- `research` - Research-related projects
- `open-source` - Open-source contributions
- `miscellaneous` - Other projects

Users can filter resources by category on your website.

## Notes

- The system automatically fetches data from HuggingFace's API
- If the API is unavailable, it shows a fallback with a direct link
- HuggingFace cards use the same styling as GitHub cards for consistency
