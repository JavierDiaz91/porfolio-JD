import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // 1. Validación de campos obligatorios
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Por favor, completa todos los campos obligatorios." },
        { status: 400 }
      )
    }

    // 2. Configuración del transportador SMTP para Gmail usando variables de entorno
    const gmailUser = process.env.GMAIL_USER?.trim()
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "")

    if (!gmailUser || !gmailAppPassword) {
      return NextResponse.json(
        { error: "El envío por correo no está configurado todavía. Podés contactarme por WhatsApp." },
        { status: 503 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    // 3. Diseño del correo en HTML (Estética Premium Oscura / Ámbar)
    const mailOptions = {
      from: gmailUser, // Remitente autenticado
      to: gmailUser,   // Te llega el aviso a vos mismo
      replyTo: email,               // Al hacer clic en "Responder", le responde al cliente
      subject: `💼 Nuevo mensaje de contacto: ${name}`,
      text: `Has recibido un nuevo mensaje de contacto en tu portfolio.\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #050505;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #e4e4e7;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #0c0c0e;
              border: 1px solid #1f1f23;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .header {
              background: linear-gradient(135deg, #78350f 0%, #1e1b4b 100%);
              padding: 32px 24px;
              border-bottom: 1px solid #27272a;
              text-align: left;
            }
            .header h1 {
              margin: 0;
              font-size: 20px;
              font-weight: 700;
              letter-spacing: -0.025em;
              color: #fef08a;
            }
            .header p {
              margin: 4px 0 0 0;
              font-size: 13px;
              color: #a1a1aa;
            }
            .content {
              padding: 32px 24px;
            }
            .field-group {
              margin-bottom: 20px;
            }
            .label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #71717a;
              margin-bottom: 4px;
              font-weight: 600;
            }
            .value {
              font-size: 15px;
              color: #f4f4f5;
              font-weight: 500;
            }
            .value a {
              color: #fbbf24;
              text-decoration: none;
            }
            .value a:hover {
              text-decoration: underline;
            }
            .message-box {
              margin-top: 24px;
              padding: 20px;
              background-color: #141416;
              border-left: 4px solid #f59e0b;
              border-radius: 4px 12px 12px 4px;
            }
            .message-text {
              margin: 0;
              font-size: 14px;
              line-height: 1.6;
              color: #d4d4d8;
              font-style: italic;
            }
            .footer {
              padding: 24px;
              background-color: #080809;
              border-top: 1px solid #1f1f23;
              text-align: center;
              font-size: 12px;
              color: #52525b;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Tienes una nueva propuesta!</h1>
              <p>Un usuario ha enviado un mensaje desde tu sitio web corporativo.</p>
            </div>
            <div class="content">
              <div class="field-group">
                <div class="label">Nombre del Interesado</div>
                <div class="value">${name}</div>
              </div>
              <div class="field-group">
                <div class="label">Correo Electrónico</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field-group">
                <div class="label">Mensaje o Detalle del Proyecto</div>
                <div class="message-box">
                  <p class="message-text">"${message.replace(/\n/g, '<br>')}"</p>
                </div>
              </div>
            </div>
            <div class="footer">
              Sistema de Telemetría y Contacto de Portfolio — Javier Diaz
            </div>
          </div>
        </body>
        </html>
      `,
    }

    // 4. Ejecución del envío del correo electrónico
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { success: true, message: "El mensaje ha sido enviado correctamente." },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error crítico en el Route Handler de contacto:", error)
    return NextResponse.json(
      { error: "Hubo un error interno en el servidor al procesar el envío." },
      { status: 500 }
    )
  }
}