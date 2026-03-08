# n8n-nodes-clarit-meilisearch

This is an n8n community node. It lets you **create and index documents** in Meilisearch directly from your n8n workflows.

> ⚠️ **This node only supports document creation (indexing).** Search, filtering, settings management, and other Meilisearch operations are not included.

[Meilisearch](https://www.meilisearch.com/) is a fast, open-source search engine. This node sends a JSON array of documents to a specified Meilisearch index. If the index does not exist, Meilisearch creates it automatically.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Self-hosted Setup](#self-hosted-setup)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Add Documents** — Index a JSON array of documents into a Meilisearch index.

## Credentials

To authenticate, you need a Meilisearch API key (Bearer token).

1. Open your Meilisearch instance
2. Go to **Settings → API Keys**
3. Copy your master key or create a dedicated key with write permissions
4. In n8n, create a new **Meilisearch Auth API** credential and paste the key

## Compatibility

- Tested with n8n version 2.x
- Requires Meilisearch v1.0 or later

## Self-hosted Setup

If you are running both n8n and Meilisearch as Docker containers, they must be on the same Docker network to communicate with each other.

By default, a self-hosted Meilisearch container runs on the `bridge` network, which is isolated from the n8n container. This means n8n cannot reach Meilisearch using its container name as a hostname.

**To fix this, run the following command once on your server:**

```bash
docker network connect n8n_default meilisearch
```

This command connects the Meilisearch container to the same internal Docker network as n8n. Once connected, Docker automatically creates an internal DNS entry, allowing n8n to reach Meilisearch using the following URL:

```
http://meilisearch:7700
```

**Why `http://meilisearch:7700`?**
- `meilisearch` is the container name resolved internally by Docker DNS
- `7700` is the default Meilisearch port
- This URL is **only accessible from within the Docker network** — it is not exposed to the internet
- No SSL/HTTPS is needed for internal Docker communication

> **Note:** `n8n_default` is the default network name when n8n is started with Docker Compose. If your setup uses a different network name, replace it accordingly. You can list all available networks with:
> ```bash
> docker network ls
> ```

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Meilisearch documentation](https://www.meilisearch.com/docs)

## Version history

### 0.1.1
- Initial release
- Add Documents operation
- Internal Docker network support

## Developer

Developed by **ClarIT** — EFICIENTA-AUTOMATIZARE-PERSONALIZARE.

🌐 [www.clarit.ro](https://www.clarit.ro/)