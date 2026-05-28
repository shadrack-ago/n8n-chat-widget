// Interactive chat widget for n8n.
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load fonts
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap';
    document.head.appendChild(fontElement);

    // Create and inject widget styles
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #10b981);
            --chat-color-secondary: var(--chat-widget-secondary, #059669);
            --chat-color-tertiary: var(--chat-widget-tertiary, #047857);
            --chat-color-light: var(--chat-widget-light, #d1fae5);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
            --chat-shadow-md: 0 8px 24px rgba(0,0,0,0.10);
            --chat-shadow-lg: 0 20px 48px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
            --chat-radius-sm: 10px;
            --chat-radius-md: 16px;
            --chat-radius-lg: 28px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'DM Sans', sans-serif;
        }

        /* Chat window container */
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 400px;
            height: 600px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid rgba(0,0,0,0.07);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
            opacity: 0;
            transform: translateY(24px) scale(0.96);
            backdrop-filter: blur(2px);
        }

        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side  { left: 20px; }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Header section */
        .chat-assist-widget .chat-header {
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--chat-color-surface);
            border-bottom: 1px solid var(--chat-color-border);
            position: relative;
            flex-shrink: 0;
        }

        /* Logo and name container */
        .chat-assist-widget .chat-header-capsule {
            display: flex;
            align-items: center;
            gap: 9px;
            background: rgba(0,0,0,0.04);
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-full);
            padding: 5px 14px 5px 6px;
            flex: 1;
            min-width: 0;
        }

        .chat-assist-widget .chat-header-logo {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            object-fit: contain;
            background: white;
            padding: 3px;
            border: 1px solid var(--chat-color-border);
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--chat-color-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }


        /* Header action buttons */
        .chat-assist-widget .chat-header-actions {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-icon-btn {
            background: none;
            border: none;
            color: var(--chat-color-text-light);
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            border-radius: var(--chat-radius-sm);
            width: 32px;
            height: 32px;
        }

        .chat-assist-widget .chat-icon-btn:hover {
            background: rgba(0,0,0,0.06);
            color: var(--chat-color-text);
        }

        .chat-assist-widget .chat-icon-btn svg {
            width: 16px;
            height: 16px;
        }

        /* Close button (legacy support) */
        .chat-assist-widget .chat-close-btn {
            background: none;
            border: none;
            color: var(--chat-color-text-light);
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            border-radius: var(--chat-radius-sm);
            width: 32px;
            height: 32px;
            font-size: 18px;
            line-height: 1;
        }

        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(0,0,0,0.06);
            color: var(--chat-color-text);
        }

        /* Welcome screen */
        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 32px 28px;
            text-align: center;
            width: 100%;
            max-width: 340px;
        }

        /* Avatar image */
        .chat-assist-widget .chat-welcome-avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 16px;
            border: 3px solid var(--chat-color-light);
            display: block;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            padding: 0;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 8px;
            line-height: 1.3;
            font-family: 'DM Serif Display', serif;
        }

        .chat-assist-widget .chat-welcome-sub {
            font-size: 13px;
            color: var(--chat-color-text-light);
            margin-bottom: 28px;
            line-height: 1.5;
        }

        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 13px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-full);
            cursor: pointer;
            font-size: 14px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 14px;
            box-shadow: 0 4px 14px rgba(16,185,129,0.35);
            letter-spacing: 0.01em;
        }

        .chat-assist-widget .chat-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16,185,129,0.45);
        }

        .chat-assist-widget .chat-response-time {
            font-size: 12px;
            color: var(--chat-color-text-light);
            margin: 0;
            text-align: center;
        }


        /* Chat body (messages and input) */
        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .chat-assist-widget .chat-body.active {
            display: flex;
        }

        /* Messages container */
        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px 18px;
            background: #f8f9fb;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar {
            width: 4px;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.12);
            border-radius: var(--chat-radius-full);
        }

        /* Bot message with avatar layout */
        .chat-assist-widget .bot-message-row {
            display: flex;
            align-items: flex-end;
            gap: 8px;
            align-self: flex-start;
            max-width: 88%;
        }

        .chat-assist-widget .bot-avatar {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: white;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .chat-assist-widget .bot-message-col {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .chat-assist-widget .bot-name-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--chat-color-text-light);
            padding-left: 2px;
            letter-spacing: 0.01em;
        }

        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: 20px;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
            box-shadow: 0 2px 8px rgba(16,185,129,0.25);
            max-width: 82%;
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            border-bottom-left-radius: 5px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid rgba(0,0,0,0.06);
        }

        /* Typing indicator animation */
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            background: white;
            border-radius: 20px;
            border-bottom-left-radius: 5px;
            width: fit-content;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid rgba(0,0,0,0.06);
        }

        .chat-assist-widget .typing-dot {
            width: 7px;
            height: 7px;
            background: var(--chat-color-primary);
            border-radius: var(--chat-radius-full);
            opacity: 0.7;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .chat-assist-widget .typing-dot:nth-child(1) { animation-delay: 0s; }
        .chat-assist-widget .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-assist-widget .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingAnimation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }

        /* Input area with controls */
        .chat-assist-widget .chat-controls {
            padding: 12px 14px 10px;
            background: var(--chat-color-surface);
            border-top: 1px solid rgba(0,0,0,0.06);
            display: flex;
            align-items: flex-end;
            gap: 8px;
        }

        .chat-assist-widget .chat-textarea-wrap {
            flex: 1;
            background: #f3f4f6;
            border: 1.5px solid transparent;
            border-radius: 18px;
            transition: var(--chat-transition);
            display: flex;
            align-items: flex-end;
            padding: 0 4px 0 0;
        }

        .chat-assist-widget .chat-textarea-wrap:focus-within {
            border-color: var(--chat-color-primary);
            background: #fff;
            box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 11px 12px;
            border: none;
            background: transparent;
            color: var(--chat-color-text);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            max-height: 120px;
            min-height: 44px;
            outline: none;
        }

        .chat-assist-widget .chat-textarea::placeholder {
            color: #b0b4bb;
        }

        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 3px 10px rgba(16,185,129,0.35);
        }

        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.08);
            box-shadow: 0 5px 16px rgba(16,185,129,0.45);
        }

        .chat-assist-widget .chat-submit svg {
            width: 18px;
            height: 18px;
        }

        /* Footer section */
        .chat-assist-widget .chat-footer {
            padding: 6px 16px 8px;
            text-align: right;
            background: var(--chat-color-surface);
        }

        .chat-assist-widget .chat-footer-link {
            color: var(--chat-color-text-light);
            text-decoration: none;
            font-size: 11px;
            opacity: 0.55;
            transition: var(--chat-transition);
            font-family: inherit;
        }

        .chat-assist-widget .chat-footer-link:hover {
            opacity: 0.85;
        }

        /* Chat launcher button */
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            height: 54px;
            border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 18px rgba(16,185,129,0.4);
            z-index: 999;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            padding: 0 20px 0 14px;
            gap: 8px;
        }

        .chat-assist-widget .chat-launcher.right-side { right: 20px; }
        .chat-assist-widget .chat-launcher.left-side  { left: 20px; }

        .chat-assist-widget .chat-launcher:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 8px 24px rgba(16,185,129,0.5);
        }

        .chat-assist-widget .chat-launcher svg {
            width: 22px;
            height: 22px;
        }

        .chat-assist-widget .chat-launcher-text {
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
            letter-spacing: 0.01em;
        }

        /* Suggested question buttons */
        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 4px 0 4px 34px; /* indent past avatar */
            align-self: flex-start;
            max-width: 92%;
        }

        .chat-assist-widget .suggested-question-btn {
            background: white;
            border: 1.5px solid var(--chat-color-border);
            border-radius: var(--chat-radius-full);
            padding: 7px 14px;
            text-align: left;
            font-size: 12.5px;
            color: var(--chat-color-text);
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
            line-height: 1.3;
            font-weight: 500;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .suggested-question-btn:hover {
            background: var(--chat-color-light);
            border-color: var(--chat-color-primary);
            color: var(--chat-color-secondary);
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(16,185,129,0.15);
        }

        /* Links in chat messages */
        .chat-assist-widget .chat-link {
            color: var(--chat-color-primary);
            text-decoration: underline;
            word-break: break-all;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-link:hover {
            color: var(--chat-color-secondary);
        }

        /* Registration form */
        .chat-assist-widget .user-registration {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 28px 28px 24px;
            text-align: center;
            width: 100%;
            max-width: 340px;
            display: none;
        }

        .chat-assist-widget .user-registration.active {
            display: block;
        }

        .chat-assist-widget .registration-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 20px;
            line-height: 1.3;
            font-family: 'DM Serif Display', serif;
        }

        .chat-assist-widget .registration-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }

        .chat-assist-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: left;
        }

        .chat-assist-widget .form-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--chat-color-text);
            letter-spacing: 0.01em;
        }

        .chat-assist-widget .form-input {
            padding: 11px 14px;
            border: 1.5px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 14px;
            background: #f8f9fb;
            color: var(--chat-color-text);
            transition: var(--chat-transition);
        }

        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        .chat-assist-widget .form-input.error {
            border-color: #ef4444;
            background: #fff5f5;
        }

        .chat-assist-widget .error-text {
            font-size: 12px;
            color: #ef4444;
            margin-top: 2px;
        }

        .chat-assist-widget .submit-registration {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 13px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-full);
            cursor: pointer;
            font-size: 14px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            box-shadow: 0 4px 14px rgba(16,185,129,0.35);
            letter-spacing: 0.01em;
        }

        .chat-assist-widget .submit-registration:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16,185,129,0.45);
        }

        .chat-assist-widget .submit-registration:disabled {
            opacity: 0.65;
            cursor: not-allowed;
            transform: none;
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default widget settings
    const defaultSettings = {
        webhook: {
            url: '',
            route: '',
            basicAuth: {
                username: 'customcx_dev_james',
                password: '1234'
            }
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by n8n',
                link: 'https://n8n.partnerlinks.io/fabimarkl'
            }
        },
        style: {
            primaryColor: '#10b981',
            secondaryColor: '#059669',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        },
        suggestedQuestions: []
    };

    // Merge config with defaults
    const settings = window.ChatWidgetConfig ?
        {
            webhook: { 
                ...defaultSettings.webhook, 
                ...window.ChatWidgetConfig.webhook,
                basicAuth: {
                    ...defaultSettings.webhook.basicAuth,
                    ...window.ChatWidgetConfig.webhook?.basicAuth
                }
            },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: { 
                ...defaultSettings.style, 
                ...window.ChatWidgetConfig.style,
                // Normalize legacy purple palette to green.
                primaryColor: window.ChatWidgetConfig.style?.primaryColor === '#854fff' ? '#10b981' : (window.ChatWidgetConfig.style?.primaryColor || '#10b981'),
                secondaryColor: window.ChatWidgetConfig.style?.secondaryColor === '#6b3fd4' ? '#059669' : (window.ChatWidgetConfig.style?.secondaryColor || '#059669')
            },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
        } : defaultSettings;

    // State tracking
    let conversationId = '';
    let isWaitingForResponse = false;
    let userCredentials = null;

    // Build widget root element
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply theme colors via CSS variables
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    // Extract initials from company name for avatar
    const brandInitials = (settings.branding.name || 'AI').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    
    // Welcome screen HTML
    const welcomeScreenHTML = `
        <div class="chat-header">
            <div class="chat-header-capsule">
                <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
                <span class="chat-header-title">${settings.branding.name}</span>

            </div>
            <div class="chat-header-actions">
                <button class="chat-close-btn" type="button" aria-label="Close chat">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        </div>
        <div class="chat-welcome">
            <img class="chat-welcome-avatar" src="${settings.branding.logo}" alt="${settings.branding.name}" onerror="this.style.display='none'">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
            <div style="height:20px"></div>
            <button class="chat-start-btn" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Start chatting
            </button>
        </div>
        <div class="user-registration">
            <h2 class="registration-title">Start chatting</h2>
            <form class="registration-form">
                <div class="form-field">
                    <label class="form-label" for="chat-user-name">Username</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="Your username" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label" for="chat-user-email">Email</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="your@email.com" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">Start Chat</button>
            </form>
        </div>
    `;

    // Chat interface HTML
    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <div class="chat-textarea-wrap">
                    <textarea class="chat-textarea" placeholder="Type your message here..." rows="1"></textarea>
                </div>
                <button class="chat-submit" type="button" aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank" rel="noopener noreferrer">${settings.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    // Create launcher button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.type = 'button';
    launchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span class="chat-launcher-text">Need help?</span>`;
    
    // Add elements to DOM, waiting for body if needed
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    if (document.body) {
        document.body.appendChild(widgetRoot);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(widgetRoot);
        }, { once: true });
    }

    // Cache DOM references
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    
    // Registration form elements
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');
    const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    const urlTestPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/im;

    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Generate unique session ID
    function createSessionId() {
        return crypto.randomUUID();
    }

    // Create typing indicator element
    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return indicator;
    }

    // Convert URLs to clickable links
    function linkifyText(text) {
        if (!text) return '';
        if (!urlTestPattern.test(text)) return text;
        
        return text.replace(urlPattern, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
        });
    }

    // Wrap bot message with avatar
    function createBotMessageRow(bubbleEl) {
        const row = document.createElement('div');
        row.className = 'bot-message-row';

        const avatar = document.createElement('div');
        avatar.className = 'bot-avatar';
        avatar.textContent = brandInitials;

        const col = document.createElement('div');
        col.className = 'bot-message-col';

        const nameLabel = document.createElement('span');
        nameLabel.className = 'bot-name-label';
        nameLabel.textContent = settings.branding.name || 'Assistant';

        col.appendChild(nameLabel);
        col.appendChild(bubbleEl);
        row.appendChild(avatar);
        row.appendChild(col);
        return row;
    }

    // Show registration form
    function showRegistrationForm() {
        chatWelcome.style.display = 'none';
        userRegistration.classList.add('active');
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Build webhook headers with company basic auth credentials
    function buildWebhookHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const basicAuth = settings.webhook?.basicAuth;
        if (basicAuth?.username && basicAuth?.password) {
            headers.Authorization = `Basic ${btoa(`${basicAuth.username}:${basicAuth.password}`)}`;
        }

        return headers;
    }

    // Handle user registration (username & email only)
    async function handleRegistration(event) {
        event.preventDefault();

        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');

        const username = nameInput.value.trim();
        const email = emailInput.value.trim();

        let isValid = true;
        if (!username) {
            nameError.textContent = 'Please enter your username';
            nameInput.classList.add('error');
            isValid = false;
        }
        if (!email) {
            emailError.textContent = 'Please enter your email';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }
        if (!isValid) return;

        conversationId = createSessionId();
        userCredentials = { username, email };

        const sessionData = [{
            action: "loadPreviousSession",
            sessionId: conversationId,
            route: settings.webhook.route,
            metadata: {
                userId: username,
                userEmail: email
            }
        }];

        try {
            userRegistration.classList.remove('active');
            chatBody.classList.add('active');

            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);

            const sessionResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: buildWebhookHeaders(),
                body: JSON.stringify(sessionData)
            });

            console.log('Session response status:', sessionResponse.status);
            console.log('Session response headers:', sessionResponse.headers);

            if (!sessionResponse.ok) {
                throw new Error(`Session request failed with status ${sessionResponse.status}: ${sessionResponse.statusText}`);
            }

            let sessionResponseData;
            const sessionText = await sessionResponse.text();
            console.log('Session response text:', sessionText);

            if (sessionText) {
                sessionResponseData = JSON.parse(sessionText);
            } else {
                sessionResponseData = {};
            }

            // Send greeting with username
            const greetingMessage = `Hi ${username}! 👋`;

            const userInfoData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: greetingMessage,
                metadata: {
                    userId: username,
                    userEmail: email,
                    isUserInfo: true
                }
            };

            // Send user info with company credentials.
            const userInfoResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: buildWebhookHeaders(),
                body: JSON.stringify(userInfoData)
            });

            console.log('User info response status:', userInfoResponse.status);

            if (!userInfoResponse.ok) {
                throw new Error(`User info request failed with status ${userInfoResponse.status}: ${userInfoResponse.statusText}`);
            }

            let userInfoResponseData;
            const userInfoText = await userInfoResponse.text();
            console.log('User info response text:', userInfoText);

            if (userInfoText) {
                userInfoResponseData = JSON.parse(userInfoText);
            } else {
                userInfoResponseData = {};
            }

            // Remove typing indicator.
            messagesContainer.removeChild(typingIndicator);

            // Render the initial bot message when present.
            const messageText = Array.isArray(userInfoResponseData) ?
                userInfoResponseData[0]?.output : userInfoResponseData?.output;

            if (messageText) {
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-bubble bot-bubble';
                botMessage.innerHTML = linkifyText(messageText);
                messagesContainer.appendChild(createBotMessageRow(botMessage));
            }

            // Render suggested questions when configured.
            if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                const suggestedQuestionsContainer = document.createElement('div');
                suggestedQuestionsContainer.className = 'suggested-questions';
                const questionFragment = document.createDocumentFragment();

                settings.suggestedQuestions.forEach(question => {
                    const questionButton = document.createElement('button');
                    questionButton.className = 'suggested-question-btn';
                    questionButton.type = 'button';
                    questionButton.textContent = question;
                    questionButton.addEventListener('click', () => {
                        submitMessage(question);
                        // Remove suggestions after selection.
                        if (suggestedQuestionsContainer.parentNode) {
                            suggestedQuestionsContainer.parentNode.removeChild(suggestedQuestionsContainer);
                        }
                    });
                    questionFragment.appendChild(questionButton);
                });

                suggestedQuestionsContainer.appendChild(questionFragment);
                messagesContainer.appendChild(suggestedQuestionsContainer);
            }

            scrollToBottom();
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error stack:', error.stack);

            // Remove typing indicator if present.
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) {
                messagesContainer.removeChild(indicator);
            }

            // Show error message.
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = `Connection error: ${error.message}. Check browser console for details.`;
            messagesContainer.appendChild(createBotMessageRow(errorMessage));
            scrollToBottom();
        }
    }

    // Send a message to the webhook
    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;

        isWaitingForResponse = true;

        const username = userCredentials?.username || "";
        const email = userCredentials?.email || "";

        const requestData = {
            action: "sendMessage",
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {
                userId: username,
                userEmail: email
            }
        };

        // Render user message.
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;

        // Show typing indicator.
        const typingIndicator = createTypingIndicator();
        messagesContainer.append(userMessage, typingIndicator);
        scrollToBottom();

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: buildWebhookHeaders(),
                body: JSON.stringify(requestData)
            });

            console.log('Message response status:', response.status);

            let responseData;
            const responseText = await response.text();
            console.log('Message response text:', responseText);

            if (responseText) {
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    console.warn('Response is not JSON, treating as plain text:', responseText);
                    responseData = { output: responseText };
                }
            } else {
                responseData = {};
            }

            // Remove typing indicator.
            messagesContainer.removeChild(typingIndicator);

            // Render bot response when present.
            const responseOutput = Array.isArray(responseData) ? responseData[0]?.output : responseData?.output;
            if (responseOutput) {
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-bubble bot-bubble';
                botMessage.innerHTML = linkifyText(responseOutput);
                messagesContainer.appendChild(createBotMessageRow(botMessage));
            }

            scrollToBottom();
        } catch (error) {
            console.error('Message submission error:', error);
            console.error('Error stack:', error.stack);

            // Remove typing indicator.
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) {
                messagesContainer.removeChild(indicator);
            }

            // Show error message.
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = `Error: ${error.message}`;
            messagesContainer.appendChild(createBotMessageRow(errorMessage));
            scrollToBottom();
        } finally {
            isWaitingForResponse = false;
        }
    }

    // Auto-resize textarea as the user types.
    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = (messageTextarea.scrollHeight > 120 ? 120 : messageTextarea.scrollHeight) + 'px';
    }

    // Event listeners.
    startChatButton.addEventListener('click', showRegistrationForm);
    registrationForm.addEventListener('submit', handleRegistration);
    
    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText && !isWaitingForResponse) {
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });
    
    messageTextarea.addEventListener('input', autoResizeTextarea);
    
    messageTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                messageTextarea.value = '';
                messageTextarea.style.height = 'auto';
            }
        }
    });
    
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    // Close button behavior.
    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        });
    });
})();