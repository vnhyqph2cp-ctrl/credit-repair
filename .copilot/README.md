# MCP Server Configuration

This directory contains the Model Context Protocol (MCP) server configuration for GitHub Copilot.

## GitHub MCP Server

The `mcp-config.json` file configures the GitHub MCP server (`ghcr.io/github/github-mcp-server`) which enables GitHub integration capabilities.

### Prerequisites

1. **Docker**: The GitHub MCP server runs in a Docker container
2. **GitHub Personal Access Token**: Required for authentication

### Setup

1. Set your GitHub Personal Access Token as an environment variable:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

2. The MCP server will be automatically started by GitHub Copilot when needed

### Configuration

The configuration uses the following structure:
- **Server ID**: `github`
- **Command**: `docker`
- **Image**: `ghcr.io/github/github-mcp-server`
- **Environment Variables**: 
  - `GITHUB_PERSONAL_ACCESS_TOKEN` - Your GitHub PAT (read from environment)

### Security Notes

- Never commit your GitHub Personal Access Token to the repository
- The token is referenced via environment variable expansion: `${GITHUB_PERSONAL_ACCESS_TOKEN}`
- Ensure your token has appropriate scopes for the operations you need

### More Information

- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification)
- [GitHub MCP Server Documentation](https://github.com/github/github-mcp-server)
