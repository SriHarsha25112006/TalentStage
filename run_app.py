import subprocess
import webbrowser
import time
import os
import sys

def run():
    print("=========================================")
    print("        TalentStage Control Panel        ")
    print("=========================================")
    print("1. Run locally (Start local backend & frontend)")
    print("2. Open deployed cloud platform (https://talentstage-4uuy.onrender.com)")
    print("=========================================")
    
    try:
        choice = input("Select an option [1-2, default: 1]: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\nExiting.")
        sys.exit(0)
        
    if choice == "2":
        print("\nOpening cloud application in browser...")
        webbrowser.open("https://talentstage-4uuy.onrender.com")
        sys.exit(0)
        
    print("\nStarting TalentStage locally...")
    
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")
    
    # Check if node modules exist
    if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
        print("Installing frontend dependencies...")
        subprocess.run("npm install", cwd=frontend_dir, shell=True)

    # Start Backend
    print("Starting backend server...")
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    
    if not os.path.exists(venv_python):
        print("\n[!] Virtual environment not found.")
        print("Please set up the backend first:")
        print("  cd backend")
        print("  python -m venv venv")
        print("  .\\venv\\Scripts\\activate")
        print("  pip install -r requirements.txt\n")
        sys.exit(1)
        
    backend_process = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "main:app", "--reload", "--host", "127.0.0.1", "--port", "8000"],
        cwd=backend_dir,
        shell=True
    )
    
    # Start Frontend
    print("Starting frontend server...")
    frontend_process = subprocess.Popen(
        "npm run dev",
        cwd=frontend_dir,
        shell=True
    )
    
    # Wait for servers to spin up
    print("Waiting for servers to start...")
    time.sleep(4)
    
    # Open Browser
    print("Opening application in browser...")
    webbrowser.open("http://localhost:5173")
    
    try:
        # Keep script running to keep child processes alive
        print("\nTalentStage is running! Press Ctrl+C to shut down.")
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down TalentStage servers...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    run()
