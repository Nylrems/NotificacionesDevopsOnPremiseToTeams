# App para mandar mensajes desde azure devops a teams (Azure devops OnPremise)

## Configuración en Teams
### Compose > inputs
    variables('adaptiveCard')

### Post card in a chat or channel > Recipient
    // Esto funciona para que tome el correo de la persona que hizo el pull request.
    // Se pueden usar cualquiera de estos 2
    - adativeCard (variables('adaptiveCard'))
    - first(filter(outputs('Compose')?['body']?[2]?['facts'], item()?['title'] == 'Email: '))?['value']

### Post card in a chat or channel > Adaptive Card
    variables('adaptiveCard')

![imagen](https://github.com/user-attachments/assets/75b90f28-b122-4334-aea2-a871ec9b443d)

## Consiguración en Windows

1. Instalar Node.js:
2. Instalar Azure Functions Core Tools

       npm install -g azure-functions-core-tools@3
   
4. Crear un Azure Function Local

       mkdir MyFunctionApp
       cd MyFunctionApp
       func init
   
6. Agregar una nueva función y ejecutar

       func new
       // Ejecutar
       func start
