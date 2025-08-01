import os

# === CONFIGURATION ===
# Path to the folder containing HTML files
directory = r"D:\dev\\code\\cyoc-backup\\cyoc-archive\\cyoc\\outlines"  # <-- CHANGE THIS

# URL to be replaced
old_url = 'https://www.cyoc.net/'          # <-- CHANGE THIS

# New URL to replace with
new_url = '/'          # <-- CHANGE THIS
# ======================

def replace_url_in_file(file_path):
    try:
        with open(file_path, 'r') as f:
            content = f.read()

        if old_url in content:
            new_content = content.replace(old_url, new_url)
            with open(file_path, 'w') as f:
                f.write(new_content)
            print(f'✅ Updated: {file_path}')
        else:
            print(f'– No match in: {file_path}')
    except Exception as e:
        print(f'⚠️ Error in {file_path}: {e}')

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.htm')):
                full_path = os.path.join(root, file)
                replace_url_in_file(full_path)

if __name__ == '__main__':
    if not os.path.exists(directory):
        print(f'❌ Directory not found: {directory}')
    else:
        process_directory(directory)
        print('✔️ Done.')
