#!/usr/bin/env python3
"""
Generate a new AI agent from template.
Usage: python generate_agent.py <agent_name>
"""

import sys
import os

def generate_agent(agent_name):
    """Generate new agent directory and files."""
    print(f"Generating agent: {agent_name}")
    # Implementation here

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_agent.py <agent_name>")
        sys.exit(1)
    generate_agent(sys.argv[1])
