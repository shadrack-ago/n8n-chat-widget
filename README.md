# n8n Chat Widget

A customizable, lightweight chat widget for integrating n8n workflows into your website. Enable AI-powered conversations directly on your web pages with minimal setup.

## Features

- **Easy Integration** - Works with vanilla HTML, Vue.js, React, and more
- **Fully Customizable** - Branding, colors, positioning, and messaging
- **Secure Authentication** - Username/email only; company credentials hardcoded server-side
- **CDN Ready** - No build process required for simple integrations
- **n8n Powered** - Leverage n8n workflows for chat intelligence
- **Production Ready** - Lightweight and performant

## Prerequisites

Before using this chat widget, you'll need:

- **n8n Instance** - A running n8n server (cloud or self-hosted)
- **Webhook URL** - Your n8n webhook URL for chat interactions
- **Company Credentials** - n8n basic auth credentials (username & password)
- **Modern Browser** - Modern JavaScript support (ES2015+)

## Installation

### Step 1: Prepare Your n8n Workflow

1. Log in to your n8n instance
2. Create a webhook endpoint in your n8n workflow to receive chat messages
3. Set up basic authentication on your webhook
4. Copy your webhook URL (you'll use this in the widget configuration)

### Step 2: Configure the Widget

Set your n8n webhook URL and company credentials in the configuration.

## Usage

### HTML/CDN Integration

The simplest way to add the chat widget to any HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>Your content here...</p>

    <!-- Chat Widget Configuration -->
    <script>
        window.ChatWidgetConfig = {
            webhook: {
                url: 'https://your-n8n-instance.com/webhook/YOUR_WEBHOOK_ID/chat',
                route: 'general',
                basicAuth: {
                    username: 'your_company_user',
                    password: 'your_company_password'
                }
            },
            branding: {
                logo: 'https://example.com/logo.png',
                name: 'Customer Support',
                welcomeText: 'Hi 👋, how can we help?',
                responseTimeText: 'We typically respond right away'
            },
            style: {
                primaryColor: '#10b981',
                secondaryColor: '#059669',
                position: 'right',
                backgroundColor: '#ffffff',
                fontColor: '#1f2937'
            },
            suggestedQuestions: [
                'What services do you offer?',
                'How can I get started?',
                'Do you offer support?'
            ]
        };
    </script>

    <!-- Chat Widget Script -->
    <script src="https://your-cdn.com/n8n-widget0hosted-play.js"></script>
</body>
</html>
```

### React Integration

For React projects, initialize the widget after component mounts:

```tsx
import { useEffect } from 'react';

export const App = () => {
    useEffect(() => {
        window.ChatWidgetConfig = {
            webhook: {
                url: 'YOUR_WEBHOOK_URL',
                route: 'general',
                basicAuth: {
                    username: 'your_company_user',
                    password: 'your_company_password'
                }
            },
            branding: {
                logo: 'YOUR_LOGO_URL',
                name: 'Your Company'
            }
        };

        // Load widget script
        const script = document.createElement('script');
        script.src = 'YOUR_WIDGET_URL/n8n-widget0hosted-play.js';
        document.body.appendChild(script);
    }, []);

    return <div>{/* Your content */}</div>;
};
```

### Vue.js Integration

For Vue.js projects:

```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    window.ChatWidgetConfig = {
        webhook: {
            url: 'YOUR_WEBHOOK_URL',
            route: 'general',
            basicAuth: {
                username: 'your_company_user',
                password: 'your_company_password'
            }
        },
        branding: {
            logo: 'YOUR_LOGO_URL',
            name: 'Your Company'
        }
    };

    const script = document.createElement('script');
    script.src = 'YOUR_WIDGET_URL/n8n-widget0hosted-play.js';
    document.body.appendChild(script);
});
</script>

<template>
    <div><!-- Your component --></div>
</template>
```

## Configuration

The widget accepts a configuration object with the following options:

```javascript
window.ChatWidgetConfig = {
    // Required
    webhook: {
        url: 'https://your-n8n-instance.com/webhook/YOUR_WEBHOOK_ID/chat',
        route: 'general',
        basicAuth: {
            username: 'your_company_user',  // Your n8n basic auth username
            password: 'your_company_password' // Your n8n basic auth password
        }
    },
    
    // Optional: Branding
    branding: {
        logo: 'YOUR_LOGO_URL',
        name: 'Your Company Name',
        welcomeText: 'Hi 👋, how can we help?',
        responseTimeText: 'We typically respond right away'
    },
    
    // Optional: Styling
    style: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        position: 'right',      // 'left' or 'right'
        backgroundColor: '#ffffff',
        fontColor: '#1f2937'
    },
    
    // Optional: Suggested questions
    suggestedQuestions: [
        'Question 1?',
        'Question 2?'
    ]
}
```

## Authentication Flow

The widget uses a secure two-tier authentication model:

1. **Company Credentials** (hardcoded in widget config)
   - Used to authenticate with n8n webhook
   - Never exposed to end users
   - Configured server-side only

2. **User Input** (collected from chat widget)
   - Username
   - Email
   - Forwarded to n8n in message metadata
   - Never used for API authentication

Users only enter their **username and email** — no password is required or stored.

## Security Notes

- **Company credentials are configured server-side** in the `basicAuth` section
- **User data (username/email)** is transmitted via HTTPS only
- **Credentials are never stored locally** on the client
- **Consider using a backend proxy** for production deployments to further protect company credentials

## File Structure

```
n8n-chat-widget/
├── README.md                    # This file
├── n8n-widget.html              # Standalone example with configuration
├── n8n-widget0hosted-play.js    # Main chat widget implementation
└── [Your n8n workflow JSON]     # n8n workflow export
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES2015+ support

## Customization

### Colors

Customize the widget appearance by changing the `style` configuration:

```javascript
style: {
    primaryColor: '#10b981',      // Main action buttons
    secondaryColor: '#059669',    // Hover states
    position: 'right'             // Widget position
}
```

### Positioning

Position the widget on the left or right:

```javascript
style: {
    position: 'left'   // or 'right'
}
```

## Troubleshooting

### Widget not showing
- Ensure `ChatWidgetConfig` is set before loading the widget script
- Check browser console for errors
- Verify webhook URL is correct

### Authentication errors
- Verify `basicAuth.username` and `basicAuth.password` are correct
- Ensure n8n webhook has authentication enabled
- Check n8n webhook logs for failed requests

### CORS errors
- Enable CORS on your n8n instance
- Use a backend proxy if needed

