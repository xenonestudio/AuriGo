import os
import sys
import subprocess
import threading
import time
import json
import webbrowser
import requests
import psutil
import customtkinter as ctk

# Configuración visual CustomTkinter basada en el Manual de Identidad AuriGo
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

# Tokens de Color Oficiales AuriGo (Sistema 60-30-10)
COLOR_BG = "#0B1120"          # Fondo ultra oscuro (Profundidad)
COLOR_CARD = "#0F172A"        # Negro Obsidiana Oficial (30% Estructural)
COLOR_CARD_HOVER = "#1E293B"  # Pizarra activa
COLOR_YELLOW = "#FFB800"      # Amarillo Aurinegro Oficial (10% CTA / Foco)
COLOR_YELLOW_HOVER = "#E5A600"
COLOR_TEXT_MAIN = "#F8FAFC"   # Blanco Niebla
COLOR_TEXT_MUTED = "#94A3B8"  # Gris Texto
COLOR_GREEN = "#16A34A"       # Verde Pino Laso (Éxito)
COLOR_RED = "#EF4444"         # Alerta
COLOR_BLUE = "#0284C7"        # Azul Río Táchira

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
LOGS_DIR = os.path.join(ROOT_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

GITHUB_REPO = "xenonestudio/AuriGo"

# Carga segura del token desde .env.local o variables de entorno del sistema
def load_github_token():
    env_local_path = os.path.join(ROOT_DIR, ".env.local")
    if os.path.exists(env_local_path):
        with open(env_local_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("GITHUB_TOKEN="):
                    return line.strip().split("=", 1)[1]
    return os.environ.get("GITHUB_TOKEN", "")

GITHUB_TOKEN = load_github_token()

class AuriGoControlCenter(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("AuriGo - Centro de Control, Despliegue & Observabilidad")
        self.geometry("1100x720")
        self.minsize(980, 640)
        self.configure(fg_color=COLOR_BG)

        # Estados de procesos
        self.backend_process = None
        self.frontend_process = None
        self.backend_log_file = os.path.join(LOGS_DIR, f"backend_{time.strftime('%Y%m%d')}.log")
        self.frontend_log_file = os.path.join(LOGS_DIR, f"frontend_{time.strftime('%Y%m%d')}.log")

        self._build_ui()
        self._start_perf_monitor()

    def _build_ui(self):
        # 1. Cabecera Moderna con Branding AuriGo y Métricas de Sistema
        header_frame = ctk.CTkFrame(self, fg_color=COLOR_CARD, corner_radius=16, height=75)
        header_frame.pack(fill="x", padx=20, pady=(15, 10))
        header_frame.pack_propagate(False)

        # Logotipo AuriGo estilizado
        logo_container = ctk.CTkFrame(header_frame, fg_color="transparent")
        logo_container.pack(side="left", padx=20, pady=12)

        pin_badge = ctk.CTkLabel(
            logo_container,
            text="📍",
            font=("Segoe UI Emoji", 24),
            fg_color=COLOR_BG,
            corner_radius=12,
            width=42,
            height=42
        )
        pin_badge.pack(side="left", padx=(0, 10))

        title_label = ctk.CTkLabel(
            logo_container,
            text="AuriGo",
            font=("Plus Jakarta Sans", 24, "bold"),
            text_color=COLOR_TEXT_MAIN
        )
        title_label.pack(side="left")

        sub_badge = ctk.CTkLabel(
            logo_container,
            text="CONTROL & OBSERVABILITY",
            font=("Inter", 9, "bold"),
            text_color=COLOR_YELLOW,
            fg_color="#1E293B",
            corner_radius=6,
            padx=8,
            pady=2
        )
        sub_badge.pack(side="left", padx=10)

        # Medidor de Rendimiento en Tiempo Real (CPU & RAM)
        perf_container = ctk.CTkFrame(header_frame, fg_color="#1E293B", corner_radius=10)
        perf_container.pack(side="right", padx=(10, 20), pady=14)

        self.perf_label = ctk.CTkLabel(
            perf_container,
            text="💻 CPU: 0.0%  |  🧠 RAM: 0.0%",
            font=("Consolas", 12, "bold"),
            text_color=COLOR_YELLOW,
            padx=14,
            pady=6
        )
        self.perf_label.pack()

        repo_btn = ctk.CTkButton(
            header_frame,
            text="🐙 Ver en GitHub",
            font=("Inter", 12, "bold"),
            fg_color="#1E293B",
            hover_color="#334155",
            text_color=COLOR_YELLOW,
            corner_radius=10,
            width=130,
            height=36,
            command=lambda: webbrowser.open(f"https://github.com/{GITHUB_REPO}")
        )
        repo_btn.pack(side="right", padx=10)

        # 2. Pestañas Principales (Tabview)
        self.tabview = ctk.CTkTabview(
            self,
            fg_color=COLOR_CARD,
            segmented_button_fg_color="#1E293B",
            segmented_button_selected_color=COLOR_YELLOW,
            segmented_button_selected_hover_color=COLOR_YELLOW_HOVER,
            text_color=COLOR_TEXT_MAIN,
            corner_radius=16
        )
        self.tabview.pack(fill="both", expand=True, padx=20, pady=(0, 15))

        # Configurar color del texto en pestaña activa
        self.tabview._segmented_button.configure(text_color=COLOR_TEXT_MAIN)

        self.tab_operations = self.tabview.add("⚡ Operaciones & Consola")
        self.tab_github = self.tabview.add("🐙 GitHub & Commits")
        self.tab_issues = self.tabview.add("🐞 Issues & Soluciones")
        self.tab_timeline = self.tabview.add("🗺️ Línea de Tiempo")

        self._build_operations_tab()
        self._build_github_tab()
        self._build_issues_tab()
        self._build_timeline_tab()

    # ================= PESTAÑA 1: OPERACIONES Y CONSOLA =================
    def _build_operations_tab(self):
        parent = self.tab_operations
        container = ctk.CTkFrame(parent, fg_color="transparent")
        container.pack(fill="both", expand=True, padx=10, pady=10)

        left_panel = ctk.CTkFrame(container, fg_color=COLOR_BG, corner_radius=14, width=320)
        left_panel.pack(side="left", fill="y", padx=(0, 10))
        left_panel.pack_propagate(False)

        # Despliegue Rápido
        git_title = ctk.CTkLabel(left_panel, text="🚀 DESPLIEGUE A GITHUB", font=("Inter", 11, "bold"), text_color=COLOR_YELLOW)
        git_title.pack(anchor="w", padx=16, pady=(16, 6))

        self.commit_entry = ctk.CTkEntry(
            left_panel,
            placeholder_text="Mensaje del cambio (commit)...",
            font=("Inter", 12),
            fg_color="#0F172A",
            border_color="#334155",
            corner_radius=10,
            height=36
        )
        self.commit_entry.pack(fill="x", padx=16, pady=(0, 8))

        self.deploy_btn = ctk.CTkButton(
            left_panel,
            text="⚡ Guardar & Desplegar Cambios",
            font=("Plus Jakarta Sans", 12, "bold"),
            fg_color=COLOR_YELLOW,
            hover_color=COLOR_YELLOW_HOVER,
            text_color=COLOR_CARD,
            corner_radius=10,
            height=36,
            command=self.deploy_to_github
        )
        self.deploy_btn.pack(fill="x", padx=16, pady=(0, 16))

        # Control de Servicios
        serv_title = ctk.CTkLabel(left_panel, text="⚙️ SERVICIOS LOCALES", font=("Inter", 11, "bold"), text_color=COLOR_TEXT_MUTED)
        serv_title.pack(anchor="w", padx=16, pady=(6, 6))

        self.backend_btn = ctk.CTkButton(
            left_panel,
            text="🟢 Iniciar Backend (Node :4000)",
            font=("Inter", 12, "bold"),
            fg_color="#1E293B",
            hover_color="#334155",
            corner_radius=10,
            height=36,
            command=self.toggle_backend
        )
        self.backend_btn.pack(fill="x", padx=16, pady=4)

        self.frontend_btn = ctk.CTkButton(
            left_panel,
            text="🟢 Iniciar Frontend (Vite :5173)",
            font=("Inter", 12, "bold"),
            fg_color="#1E293B",
            hover_color="#334155",
            corner_radius=10,
            height=36,
            command=self.toggle_frontend
        )
        self.frontend_btn.pack(fill="x", padx=16, pady=4)

        self.all_btn = ctk.CTkButton(
            left_panel,
            text="⚡ Iniciar Plataforma Completa",
            font=("Inter", 12, "bold"),
            fg_color="#0284C7",
            hover_color="#0369A1",
            text_color="#FFFFFF",
            corner_radius=10,
            height=36,
            command=self.start_all_services
        )
        self.all_btn.pack(fill="x", padx=16, pady=(8, 8))

        open_web_btn = ctk.CTkButton(
            left_panel,
            text="🌐 Abrir AuriGo Web App",
            font=("Inter", 12),
            fg_color="transparent",
            border_width=1,
            border_color="#334155",
            text_color=COLOR_TEXT_MAIN,
            hover_color="#1E293B",
            corner_radius=10,
            height=34,
            command=lambda: webbrowser.open("http://localhost:5173")
        )
        open_web_btn.pack(fill="x", padx=16, pady=4)

        # Consola de Logs con Auto-Guardado en Archivo
        right_panel = ctk.CTkFrame(container, fg_color=COLOR_BG, corner_radius=14)
        right_panel.pack(side="right", fill="both", expand=True)

        log_bar = ctk.CTkFrame(right_panel, fg_color="transparent")
        log_bar.pack(fill="x", padx=16, pady=(12, 6))

        ctk.CTkLabel(log_bar, text="LOGS EN VIVO & ARCHIVADOS EN DISCO", font=("Inter", 11, "bold"), text_color=COLOR_TEXT_MUTED).pack(side="left")

        open_logs_folder_btn = ctk.CTkButton(
            log_bar,
            text="📁 Abrir Carpeta de Logs",
            font=("Inter", 11),
            fg_color="#1E293B",
            text_color=COLOR_YELLOW,
            hover_color="#334155",
            height=26,
            command=lambda: os.startfile(LOGS_DIR)
        )
        open_logs_folder_btn.pack(side="right", padx=(6, 0))

        clear_btn = ctk.CTkButton(
            log_bar,
            text="Limpiar",
            font=("Inter", 11),
            fg_color="transparent",
            text_color=COLOR_TEXT_MUTED,
            hover_color="#1E293B",
            width=50,
            height=26,
            command=self.clear_logs
        )
        clear_btn.pack(side="right")

        self.log_textbox = ctk.CTkTextbox(
            right_panel,
            fg_color="#060A12",
            text_color="#38BDF8",
            font=("Consolas", 12),
            corner_radius=10
        )
        self.log_textbox.pack(fill="both", expand=True, padx=16, pady=(0, 16))

        self.log(f"🚀 Centro de Operaciones listo. Logs persistiendo en {LOGS_DIR}")

    # ================= PESTAÑA 2: GITHUB Y COMMITS =================
    def _build_github_tab(self):
        parent = self.tab_github
        container = ctk.CTkFrame(parent, fg_color="transparent")
        container.pack(fill="both", expand=True, padx=10, pady=10)

        top_bar = ctk.CTkFrame(container, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 10))

        ctk.CTkLabel(top_bar, text="HISTORIAL DE COMMITS Y ARCHIVOS EN REPOSITORIO", font=("Inter", 12, "bold"), text_color=COLOR_YELLOW).pack(side="left")

        refresh_btn = ctk.CTkButton(
            top_bar,
            text="🔄 Actualizar desde GitHub",
            font=("Inter", 11, "bold"),
            fg_color="#1E293B",
            hover_color="#334155",
            text_color=COLOR_YELLOW,
            height=30,
            command=self.fetch_github_data
        )
        refresh_btn.pack(side="right")

        # Vista de Commits
        self.commits_box = ctk.CTkTextbox(
            container,
            fg_color=COLOR_BG,
            text_color=COLOR_TEXT_MAIN,
            font=("Consolas", 12),
            corner_radius=12
        )
        self.commits_box.pack(fill="both", expand=True)
        self.fetch_github_data()

    def fetch_github_data(self):
        def _fetch():
            headers = {
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "User-Agent": "AuriGo-ControlCenter",
                "Accept": "application/vnd.github.v3+json"
            }
            try:
                # 1. Obtener Commits
                url_commits = f"https://api.github.com/repos/{GITHUB_REPO}/commits?per_page=15"
                res_commits = requests.get(url_commits, headers=headers, timeout=10)
                
                output = "📋 ÚLTIMOS COMMITS EN 'main':\n"
                output += "=" * 80 + "\n\n"
                
                if res_commits.status_code == 200:
                    for c in res_commits.json():
                        sha = c['sha'][:7]
                        msg = c['commit']['message'].split('\n')[0]
                        author = c['commit']['author']['name']
                        date = c['commit']['author']['date'].replace('T', ' ').replace('Z', ' UTC')
                        output += f"🔹 [{sha}] {date} - {author}\n   └─ {msg}\n\n"
                else:
                    output += f"⚠️ Error obteniendo commits ({res_commits.status_code}): {res_commits.text}\n"

                # 2. Obtener Árbol de Archivos Principales
                url_tree = f"https://api.github.com/repos/{GITHUB_REPO}/git/trees/main?recursive=1"
                res_tree = requests.get(url_tree, headers=headers, timeout=10)
                output += "\n📁 ESTRUCTURA DE ARCHIVOS EN GITHUB:\n"
                output += "=" * 80 + "\n"
                if res_tree.status_code == 200:
                    tree_data = res_tree.json().get('tree', [])
                    for item in tree_data:
                        if item['type'] == 'blob':
                            output += f"   📄 {item['path']} ({item.get('size', 0)} bytes)\n"
                        elif item['type'] == 'tree':
                            output += f"   📂 {item['path']}/\n"

                self.commits_box.delete("1.0", "end")
                self.commits_box.insert("end", output)
            except Exception as e:
                self.commits_box.delete("1.0", "end")
                self.commits_box.insert("end", f"❌ Error conectando con la API de GitHub: {str(e)}")

        threading.Thread(target=_fetch, daemon=True).start()

    # ================= PESTAÑA 3: ISSUES & SOLUCIONES =================
    def _build_issues_tab(self):
        parent = self.tab_issues
        container = ctk.CTkFrame(parent, fg_color="transparent")
        container.pack(fill="both", expand=True, padx=10, pady=10)

        # Panel izquierdo: Formulario para crear Issue
        form_panel = ctk.CTkFrame(container, fg_color=COLOR_BG, corner_radius=14, width=360)
        form_panel.pack(side="left", fill="y", padx=(0, 10))
        form_panel.pack_propagate(False)

        ctk.CTkLabel(form_panel, text="REGISTRAR NUEVO ERROR O ISSUE", font=("Inter", 12, "bold"), text_color=COLOR_YELLOW).pack(anchor="w", padx=16, pady=(16, 8))

        ctk.CTkLabel(form_panel, text="Título del Error / Reporte:", font=("Inter", 11), text_color=COLOR_TEXT_MUTED).pack(anchor="w", padx=16)
        self.issue_title_entry = ctk.CTkEntry(form_panel, placeholder_text="Ej: Error al calcular ruta en OSM...", font=("Inter", 12), fg_color="#0F172A", border_color="#334155", corner_radius=8, height=34)
        self.issue_title_entry.pack(fill="x", padx=16, pady=(2, 10))

        ctk.CTkLabel(form_panel, text="Descripción detallada o Log del Error:", font=("Inter", 11), text_color=COLOR_TEXT_MUTED).pack(anchor="w", padx=16)
        self.issue_body_entry = ctk.CTkTextbox(form_panel, font=("Consolas", 11), fg_color="#0F172A", border_color="#334155", border_width=1, corner_radius=8, height=130)
        self.issue_body_entry.pack(fill="x", padx=16, pady=(2, 10))

        ctk.CTkLabel(form_panel, text="Solución prevista o aplicada (opcional):", font=("Inter", 11), text_color=COLOR_TEXT_MUTED).pack(anchor="w", padx=16)
        self.issue_sol_entry = ctk.CTkTextbox(form_panel, font=("Consolas", 11), fg_color="#0F172A", border_color="#334155", border_width=1, corner_radius=8, height=80)
        self.issue_sol_entry.pack(fill="x", padx=16, pady=(2, 12))

        self.create_issue_btn = ctk.CTkButton(
            form_panel,
            text="🐞 Crear Issue en GitHub",
            font=("Plus Jakarta Sans", 12, "bold"),
            fg_color=COLOR_YELLOW,
            hover_color=COLOR_YELLOW_HOVER,
            text_color=COLOR_CARD,
            corner_radius=10,
            height=36,
            command=self.create_github_issue
        )
        self.create_issue_btn.pack(fill="x", padx=16, pady=(0, 16))

        # Panel derecho: Lista de Issues abiertas y cerradas
        list_panel = ctk.CTkFrame(container, fg_color=COLOR_BG, corner_radius=14)
        list_panel.pack(side="right", fill="both", expand=True)

        list_bar = ctk.CTkFrame(list_panel, fg_color="transparent")
        list_bar.pack(fill="x", padx=16, pady=(12, 6))

        ctk.CTkLabel(list_bar, text="ISSUES Y SOLUCIONES EN GITHUB", font=("Inter", 11, "bold"), text_color=COLOR_TEXT_MUTED).pack(side="left")

        refresh_issues_btn = ctk.CTkButton(
            list_bar,
            text="🔄 Actualizar",
            font=("Inter", 11),
            fg_color="#1E293B",
            hover_color="#334155",
            text_color=COLOR_YELLOW,
            height=26,
            width=70,
            command=self.fetch_github_issues
        )
        refresh_issues_btn.pack(side="right")

        self.issues_box = ctk.CTkTextbox(
            list_panel,
            fg_color="#060A12",
            text_color=COLOR_TEXT_MAIN,
            font=("Consolas", 12),
            corner_radius=10
        )
        self.issues_box.pack(fill="both", expand=True, padx=16, pady=(0, 16))
        self.fetch_github_issues()

    def create_github_issue(self):
        title = self.issue_title_entry.get().strip()
        body = self.issue_body_entry.get("1.0", "end").strip()
        solution = self.issue_sol_entry.get("1.0", "end").strip()

        if not title:
            self.log("⚠️ Debes ingresar un título para el issue.")
            return

        full_body = f"### Descripción del Problema / Log:\n```\n{body}\n```\n\n"
        if solution:
            full_body += f"### Solución Implementada / Prevista:\n{solution}\n\n"
        full_body += f"_Reportado automáticamente desde AuriGo Control Center el {time.strftime('%Y-%m-%d %H:%M:%S')}_"

        self.create_issue_btn.configure(state="disabled", text="⏳ Creando...")

        def _task():
            headers = {
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "User-Agent": "AuriGo-ControlCenter",
                "Accept": "application/vnd.github.v3+json"
            }
            try:
                url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
                res = requests.post(url, headers=headers, json={"title": title, "body": full_body}, timeout=10)
                if res.status_code == 201:
                    issue_num = res.json().get('number')
                    issue_url = res.json().get('html_url')
                    self.log(f"🎉 Issue #{issue_num} creado exitosamente: {issue_url}")
                    self.issue_title_entry.delete(0, "end")
                    self.issue_body_entry.delete("1.0", "end")
                    self.issue_sol_entry.delete("1.0", "end")
                    self.fetch_github_issues()
                else:
                    self.log(f"⚠️ Error creando issue ({res.status_code}): {res.text}")
            except Exception as e:
                self.log(f"❌ Error conectando a GitHub: {str(e)}")
            finally:
                self.create_issue_btn.configure(state="normal", text="🐞 Crear Issue en GitHub")

        threading.Thread(target=_task, daemon=True).start()

    def fetch_github_issues(self):
        def _fetch():
            headers = {
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "User-Agent": "AuriGo-ControlCenter",
                "Accept": "application/vnd.github.v3+json"
            }
            try:
                url = f"https://api.github.com/repos/{GITHUB_REPO}/issues?state=all"
                res = requests.get(url, headers=headers, timeout=10)
                output = "📋 LISTADO DE ISSUES REGISTRADOS:\n"
                output += "=" * 80 + "\n\n"

                if res.status_code == 200:
                    issues = res.json()
                    if not issues:
                        output += "✨ No hay issues abiertos ni cerrados actualmente.\n"
                    for iss in issues:
                        state_icon = "🟢 ABIERTO" if iss['state'] == 'open' else "🟣 RESUELTO"
                        output += f"#{iss['number']} [{state_icon}] {iss['title']}\n"
                        output += f"   Creado por: {iss['user']['login']} el {iss['created_at'][:10]}\n"
                        output += f"   Enlace: {iss['html_url']}\n"
                        output += f"   Detalle:\n{iss['body']}\n"
                        output += "-" * 80 + "\n\n"
                else:
                    output += f"⚠️ Error obteniendo issues ({res.status_code})\n"

                self.issues_box.delete("1.0", "end")
                self.issues_box.insert("end", output)
            except Exception as e:
                self.issues_box.delete("1.0", "end")
                self.issues_box.insert("end", f"❌ Error: {str(e)}")

        threading.Thread(target=_fetch, daemon=True).start()

    # ================= PESTAÑA 4: LÍNEA DE TIEMPO =================
    def _build_timeline_tab(self):
        parent = self.tab_timeline
        container = ctk.CTkFrame(parent, fg_color="transparent")
        container.pack(fill="both", expand=True, padx=10, pady=10)

        top_bar = ctk.CTkFrame(container, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 10))

        ctk.CTkLabel(top_bar, text="PROJECT_TIMELINE.MD & HISTORIAL ESTRATÉGICO", font=("Inter", 12, "bold"), text_color=COLOR_YELLOW).pack(side="left")

        reload_tl_btn = ctk.CTkButton(
            top_bar,
            text="🔄 Recargar Archivo",
            font=("Inter", 11),
            fg_color="#1E293B",
            hover_color="#334155",
            text_color=COLOR_YELLOW,
            height=28,
            command=self.load_timeline_file
        )
        reload_tl_btn.pack(side="right")

        self.timeline_box = ctk.CTkTextbox(
            container,
            fg_color=COLOR_BG,
            text_color=COLOR_TEXT_MAIN,
            font=("Consolas", 12),
            corner_radius=12
        )
        self.timeline_box.pack(fill="both", expand=True)
        self.load_timeline_file()

    def load_timeline_file(self):
        tl_path = os.path.join(ROOT_DIR, "PROJECT_TIMELINE.md")
        if os.path.exists(tl_path):
            with open(tl_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.timeline_box.delete("1.0", "end")
            self.timeline_box.insert("end", content)
        else:
            self.timeline_box.delete("1.0", "end")
            self.timeline_box.insert("end", "⚠️ Archivo PROJECT_TIMELINE.md no encontrado.")

    # ================= MONITOREO DE RENDIMIENTO =================
    def _start_perf_monitor(self):
        def _perf_loop():
            while True:
                cpu = psutil.cpu_percent(interval=1)
                ram = psutil.virtual_memory().percent
                try:
                    self.perf_label.configure(text=f"💻 CPU: {cpu:.1f}%  |  🧠 RAM: {ram:.1f}%")
                except:
                    break
        threading.Thread(target=_perf_loop, daemon=True).start()

    # ================= LOGS Y CONTROL =================
    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] {message}\n"
        try:
            self.log_textbox.insert("end", entry)
            self.log_textbox.see("end")
        except:
            pass

        # Persistir en archivo de log general
        general_log = os.path.join(LOGS_DIR, f"operations_{time.strftime('%Y%m%d')}.log")
        with open(general_log, "a", encoding="utf-8") as f:
            f.write(entry)

    def clear_logs(self):
        self.log_textbox.delete("1.0", "end")

    def deploy_to_github(self):
        commit_msg = self.commit_entry.get().strip()
        if not commit_msg:
            commit_msg = f"chore: updates and improvements ({time.strftime('%Y-%m-%d %H:%M')})"

        self.deploy_btn.configure(state="disabled", text="⏳ Desplegando...")

        def _task():
            try:
                self.log(f"📦 Preparando commit: '{commit_msg}'...")
                subprocess.run(["git", "add", "."], cwd=ROOT_DIR, check=True)
                
                res_commit = subprocess.run(["git", "commit", "-m", commit_msg], cwd=ROOT_DIR, capture_output=True, text=True)
                if "nothing to commit" in res_commit.stdout or "nada para confirmar" in res_commit.stdout:
                    self.log("ℹ️ No hay cambios pendientes por commitear.")
                else:
                    self.log("✅ Commit creado localmente.")

                self.log("🌐 Subiendo cambios a GitHub (git push origin main)...")
                res_push = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT_DIR, capture_output=True, text=True)
                
                if res_push.returncode == 0:
                    self.log("🎉 ¡Despliegue exitoso en GitHub!")
                    self.log(f"🔗 Ver en: https://github.com/{GITHUB_REPO}")
                    self.fetch_github_data()
                else:
                    self.log(f"⚠️ Error en push: {res_push.stderr}")
            except Exception as e:
                self.log(f"❌ Error durante el despliegue: {str(e)}")
            finally:
                self.deploy_btn.configure(state="normal", text="⚡ Guardar & Desplegar Cambios")
                self.commit_entry.delete(0, "end")

        threading.Thread(target=_task, daemon=True).start()

    def toggle_backend(self):
        if self.backend_process is None:
            self.log("⚡ Iniciando Backend Node.js en http://localhost:4000...")
            try:
                self.backend_process = subprocess.Popen(
                    ["npx", "tsx", "src/server.ts"],
                    cwd=BACKEND_DIR,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    shell=True
                )
                self.backend_btn.configure(text="🛑 Detener Backend", fg_color="#991B1B", hover_color="#7F1D1D")
                
                def _stream_backend():
                    with open(self.backend_log_file, "a", encoding="utf-8") as bf:
                        for line in iter(self.backend_process.stdout.readline, ''):
                            if line:
                                formatted = f"[Backend] {line.strip()}"
                                self.log(formatted)
                                bf.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {line}")
                                bf.flush()
                threading.Thread(target=_stream_backend, daemon=True).start()
            except Exception as e:
                self.log(f"❌ Error iniciando backend: {e}")
        else:
            self.log("🛑 Deteniendo Backend...")
            self.backend_process.terminate()
            self.backend_process = None
            self.backend_btn.configure(text="🟢 Iniciar Backend (Node :4000)", fg_color="#1E293B", hover_color="#334155")

    def toggle_frontend(self):
        if self.frontend_process is None:
            self.log("⚡ Iniciando Frontend Vite en http://localhost:5173...")
            try:
                self.frontend_process = subprocess.Popen(
                    ["npm", "run", "dev"],
                    cwd=FRONTEND_DIR,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    shell=True
                )
                self.frontend_btn.configure(text="🛑 Detener Frontend", fg_color="#991B1B", hover_color="#7F1D1D")
                
                def _stream_frontend():
                    with open(self.frontend_log_file, "a", encoding="utf-8") as ff:
                        for line in iter(self.frontend_process.stdout.readline, ''):
                            if line:
                                formatted = f"[Frontend] {line.strip()}"
                                self.log(formatted)
                                ff.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {line}")
                                ff.flush()
                threading.Thread(target=_stream_frontend, daemon=True).start()
            except Exception as e:
                self.log(f"❌ Error iniciando frontend: {e}")
        else:
            self.log("🛑 Deteniendo Frontend...")
            self.frontend_process.terminate()
            self.frontend_process = None
            self.frontend_btn.configure(text="🟢 Iniciar Frontend (Vite :5173)", fg_color="#1E293B", hover_color="#334155")

    def start_all_services(self):
        if self.backend_process is None:
            self.toggle_backend()
        if self.frontend_process is None:
            self.toggle_frontend()

if __name__ == "__main__":
    app = AuriGoControlCenter()
    app.mainloop()
