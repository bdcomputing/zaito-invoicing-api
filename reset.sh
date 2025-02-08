#!/bin/bash

# Function to handle .env file creation or overwrite
handle_env_file() {
  if [ ! -f ".env" ]; then
    # If .env does not exist, ask if the user wants to create it
    if [ -f ".env.example" ]; then
      read -p ".env file is missing. Do you want to create it from .env.example? (yes/no): " create_confirmation
      if [[ "$create_confirmation" == "yes" ]]; then
        cp .env.example .env
        echo "Copied .env.example to .env."
      else
        echo "Skipped creating .env file."
      fi
    else
      echo "Error: .env.example file not found."
    fi
  else
    # If .env exists, prompt for overwrite
    read -p ".env file already exists. Do you want to overwrite it? (yes/no): " overwrite_confirmation
    if [[ "$overwrite_confirmation" == "yes" ]]; then
      cp .env.example .env
      echo "Overwrote .env with .env.example."
    else
      echo "Skipped overwriting .env."
    fi
  fi
}

# Function to reset the version in package.json
reset_package_json_version() {
  if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in the current directory."
    return
  fi

  # Backup the original package.json
  cp package.json package.json.bak

  # Reset the version in package.json to 1.0.0
  local reset_version="1.0.0"
  jq --arg reset_version "$reset_version" '.version = $reset_version' package.json > package.json.tmp && mv package.json.tmp package.json

  echo "Reset package.json version to $reset_version."
}

# Function to clear or create CHANGELOG.md
clear_changelog() {
  if [ ! -f "CHANGELOG.md" ]; then
    touch CHANGELOG.md
    echo "Created a new CHANGELOG.md file."
  fi

  # Clear the contents of CHANGELOG.md
  > CHANGELOG.md
  echo "Cleared the contents of CHANGELOG.md."
}

# Function to run the npm script
run_npm_script() {
  if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm."
    return 1
  fi

  # Run the npm script
  echo "Running 'npm run get-app-version'..."
  npm run get-app-version

  # Check the exit status of the npm command
  if [ $? -eq 0 ]; then
    echo "'npm run get-app-version' completed successfully."
  else
    echo "Error: 'npm run get-app-version' failed."
    return 1
  fi
}

# Main script
main() {
  # Prompt the user for confirmation to reset the app
  read -p "Are you sure you want to reset the app (version to 1.0.0, clear CHANGELOG.md, and handle .env)? (yes/no): " confirmation

  if [[ "$confirmation" != "yes" ]]; then
    echo "Reset operation canceled."
    exit 0
  fi

  # Call individual functions
  handle_env_file
  reset_package_json_version
  clear_changelog
  run_npm_script

  echo "Reset operation completed."
}

# Execute the main function
main