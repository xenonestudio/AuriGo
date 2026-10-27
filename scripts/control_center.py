import os
import sys
import subprocess
import threading
import time
import webbrowser
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

class AuriGoControlCenter(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("AuriGo - Centro de Operaciones & Despliegue")
        self.geometry("900x640")
        self.minsize(800, 560)
        self.configure(fg_color=COLOR_BG)

        # Estados de procesos
        self.backend_process = None
        self.frontend_process = None

        self._build_ui()

    def _build_ui(self):
        # 1. Cabecera Moderna con Branding AuriGo
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
            text="OPERATIONS CENTER",
            font=("Inter", 9, "bold"),
            text_color=COLOR_YELLOW,
            fg_color="#1E293B",
            corner_radius=6,
            padx=8,
            pady=2
        )
        sub_badge.pack(side="left", padx=10)

        # Botón para abrir el repositorio de GitHub directamente
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
            command=lambda: webbrowser.open("https://github.com/xenonestudio/AuriGo")
        )
        repo_btn.pack(side="right", padx=20)

        # 2. Contenedor Principal (Panel Dividido: Control + Consola)
        main_container = ctk.CTkFrame(self, fg_color="transparent")
        main_container.pack(fill="both", expand=True, padx=20, pady=10)

        # Panel Izquierdo: Acciones Rápidas y Servicios
        left_panel = ctk.CTkFrame(main_container, fg_color=COLOR_CARD, corner_radius=16, width=320)
        left_panel.pack(side="left", fill="y", padx=(0, 10), pady=0)
        left_panel.pack_propagate(False)

        # Sección: Despliegue Automatizado a GitHub
        git_title = ctk.CTkLabel(
            left_panel,
            text="🚀 DESPLIEGUE A GITHUB",
            font=("Inter", 11, "bold"),
            text_color=COLOR_YELLOW
        )
        git_title.pack(anchor="w", padx=18, pady=(18, 6))

        self.commit_entry = ctk.CTkEntry(
            left_panel,
            placeholder_text="Mensaje del cambio (commit)...",
            font=("Inter", 12),
            fg_color=COLOR_BG,
            border_color="#334155",
            corner_radius=10,
            height=38
        )
        self.commit_entry.pack(fill="x", padx=18, pady=(0, 8))

        self.deploy_btn = ctk.CTkButton(
            left_panel,
            text="⚡ Guardar & Desplegar Cambios",
            font=("Plus Jakarta Sans", 12, "bold"),
            fg_color=COLOR_YELLOW,
            hover_color=COLOR_YELLOW_HOVER,
            text_color=COLOR_CARD,
            corner_radius=10,
            height=38,
            command=self.deploy_to_github
        )
        self.deploy_btn.pack(fill="x", padx=18, pady=(0, 18))

        # Divisor sutil
        divider = ctk.CTkFrame(left_panel, fg_color="#1E293B", height=1)
        divider.pack(fill="x", padx=18, pady=4)

        # Sección: Control de Servicios Locales
        services_title = ctk.CTkLabel(
            left_panel,
            text="⚙️ SERVICIOS & SERVIDORES",
            font=("Inter", 11, "bold"),
            text_color=COLOR_TEXT_MUTED
        )
        services_title.pack(anchor="w", padx=18, pady=(12, 8))

        # Backend Switch Button
        self.backend_btn = ctk.CTkButton(
            left_panel,
            text="🟢 Iniciar Backend (Node.js :4000)",
            font=("Inter", 12, "bold"),
            fg_color="#1E293B",
            hover_color="#334155",
            corner_radius=10,
            height=38,
            command=self.toggle_backend
        )
        self.backend_btn.pack(fill="x", padx=18, pady=4)

        # Frontend Switch Button
        self.frontend_btn = ctk.CTkButton(
            left_panel,
            text="🟢 Iniciar Frontend (Vite :5173)",
            font=("Inter", 12, "bold"),
            fg_color="#1E293B",
            hover_color="#334155",
            corner_radius=10,
            height=38,
            command=self.toggle_frontend
        )
        self.frontend_btn.pack(fill="x", padx=18, pady=4)

        # Botón para iniciar ambos a la vez
        self.all_btn = ctk.CTkButton(
            left_panel,
            text="⚡ Iniciar Plataforma Completa",
            font=("Inter", 12, "bold"),
            fg_color="#0284C7",
            hover_color="#0369A1",
            text_color="#FFFFFF",
            corner_radius=10,
            height=38,
            command=self.start_all_services
        )
        self.all_btn.pack(fill="x", padx=18, pady=(10, 10))

        # Botón para abrir la Web App en el navegador
        open_web_btn = ctk.CTkButton(
            left_panel,
            text="🌐 Abrir AuriGo en Navegador",
            font=("Inter", 12),
            fg_color="transparent",
            border_width=1,
            border_color="#334155",
            text_color=COLOR_TEXT_MAIN,
            hover_color="#1E293B",
            corner_radius=10,
            height=36,
            command=lambda: webbrowser.open("http://localhost:5173")
        )
        open_web_btn.pack(fill="x", padx=18, pady=4)

        # Panel Derecho: Consola Interactiva y Logs
        right_panel = ctk.CTkFrame(main_container, fg_color=COLOR_CARD, corner_radius=16)
        right_panel.pack(side="right", fill="both", expand=True)

        log_header = ctk.CTkFrame(right_panel, fg_color="transparent")
        log_header.pack(fill="x", padx=18, pady=(14, 8))

        log_title = ctk.CTkLabel(
            log_header,
            text="TERMINAL DE LOGS & ESTADO EN TIEMPO REAL",
            font=("Inter", 11, "bold"),
            text_color=COLOR_TEXT_MUTED
        )
        log_title.pack(side="left")

        clear_btn = ctk.CTkButton(
            log_header,
            text="Limpiar",
            font=("Inter", 11),
            fg_color="transparent",
            text_color=COLOR_TEXT_MUTED,
            hover_color="#1E293B",
            width=60,
            height=26,
            command=self.clear_logs
        )
        clear_btn.pack(side="right")

        self.log_textbox = ctk.CTkTextbox(
            right_panel,
            fg_color=COLOR_BG,
            text_color="#38BDF8",
            font=("Consolas", 12),
            corner_radius=12,
            border_width=1,
            border_color="#1E293B"
        )
        self.log_textbox.pack(fill="both", expand=True, padx=18, pady=(0, 18))

        self.log("🚀 AuriGo Operations Center inicializado con éxito.")
        self.log(f"📁 Directorio raíz: {ROOT_DIR}")
        self.log("💡 Escribe un mensaje de commit y haz clic en 'Guardar & Desplegar' para sincronizar con GitHub.\n")

    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.log_textbox.insert("end", f"[{timestamp}] {message}\n")
        self.log_textbox.see("end")

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
                
                # Commit
                res_commit = subprocess.run(["git", "commit", "-m", commit_msg], cwd=ROOT_DIR, capture_output=True, text=True)
                if "nothing to commit" in res_commit.stdout or "nada para confirmar" in res_commit.stdout:
                    self.log("ℹ️ No hay cambios pendientes por commitear.")
                else:
                    self.log("✅ Commit creado localmente.")

                self.log("🌐 Subiendo cambios a GitHub (git push origin main)...")
                res_push = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT_DIR, capture_output=True, text=True)
                
                if res_push.returncode == 0:
                    self.log("🎉 ¡Despliegue exitoso en GitHub!")
                    self.log("🔗 Ver en: https://github.com/xenonestudio/AuriGo")
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
                    for line in iter(self.backend_process.stdout.readline, ''):
                        if line:
                            self.log(f"[Backend] {line.strip()}")
                threading.Thread(target=_stream_backend, daemon=True).start()
            except Exception as e:
                self.log(f"❌ Error iniciando backend: {e}")
        else:
            self.log("🛑 Deteniendo Backend...")
            self.backend_process.terminate()
            self.backend_process = None
            self.backend_btn.configure(text="🟢 Iniciar Backend (Node.js :4000)", fg_color="#1E293B", hover_color="#334155")

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
                    for line in iter(self.frontend_process.stdout.readline, ''):
                        if line:
                            self.log(f"[Frontend] {line.strip()}")
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
