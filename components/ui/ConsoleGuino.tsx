"use client"

import { useEffect } from "react"
import { About } from "@/components/About"


export function ConsoleGuino() {
  useEffect(() => {
    console.log(
      "%c¡Ey! ¿Qué hacés mirando acá adentro? 😂💻", 
      "color: #71717a; font-size: 14px; font-family: monospace; padding: 4px 0; font-weight: 600;"
    );
    console.log(
      "%cSi estás buscando código limpio, APIs en C# sólidas y cero NullReferenceException, ¡hablemos!", 
      "color: #e4e4e7; font-size: 14px; font-family: monospace; padding: 4px 0;"
    );
    console.log(
      "%cContacto: contacto@javierdiaz.dev", 
      "color: #fb923c; font-size: 14px; font-weight: bold; font-family: monospace;"
    );
  }, []);

  return null; 
}