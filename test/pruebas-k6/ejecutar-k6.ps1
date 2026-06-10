
$env:K6_WEB_DASHBOARD="true"
$env:K6_WEB_DASHBOARD_EXPORT="reporte-k6-ecommerce.html"

k6 run ecommerce-test.js

# Comando para ejecutar pruebas
# .\ejecutar-k6.ps1
