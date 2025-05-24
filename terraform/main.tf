terraform {
  required_providers {
    render = {
      source = "render-oss/render"
      version = "1.6.0"
    }
  }
}

provider "render" {
  api_key = var.render_api_key
  owner_id = var.render_owner_id
}

resource "render_web_service" "api" {
  name               = "autou"
  plan               = "hobby"
  region             = "oregon"
  start_command      = "gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 1" 

  runtime_source = {
    native_runtime = {
      auto_deploy   = true
      branch        = "main"
      build_command = "pip install -r requirements.txt"
      repo_url = "https://github.com/joaocansi/desafio-autou"
      runtime  = "python"
    }
  }

  disk = {
    name       = "comuni-dev"
    size_gb    = 1
    mount_path = "/data"
  }

  env_vars = {
    "OPENAI_API_KEY" = { value = var.openai_api_key },
    "HUGGINGFACE_SPACE" = { value = var.huggingface_space }
  }

  notification_override = {
    preview_notifications_enabled = "false"
    notifications_to_send         = "failure"
  }

  log_stream_override = {
    setting = "drop"
  }
}