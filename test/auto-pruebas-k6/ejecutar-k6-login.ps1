
$env:K6_WEB_DASHBOARD="true"
$env:K6_WEB_DASHBOARD_EXPORT="reporte-k6-ecommerce-login.html"

k6 run ecommerce-test-login.js

# Comando para ejecutar pruebas
# .\ejecutar-k6-login.ps1
