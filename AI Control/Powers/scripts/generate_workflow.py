#!/usr/bin/env python3
"""
Generate a new workflow from template.
Usage: python generate_workflow.py <workflow_name>
"""

import sys
import os

def generate_workflow(workflow_name):
    """Generate new workflow file."""
    print(f"Generating workflow: {workflow_name}")
    # Implementation here

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_workflow.py <workflow_name>")
        sys.exit(1)
    generate_workflow(sys.argv[1])
