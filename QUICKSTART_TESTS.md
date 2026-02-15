# 🚀 Guía Rápida: Ejecutar Tests de Integración

## Paso 1: Abre la App

Asegúrate de que tu app esté corriendo:
```bash
npx expo start
```

Luego abre la app en:
- 📱 Tu dispositivo físico (escanea el QR)
- 🖥️ Emulador de Android
- 📱 Simulador de iOS
- 🌐 Navegador web (presiona `w` en la terminal)

---

## Paso 2: Navega al Test Suite

### Opción A: Desde la pantalla de Inicio
1. Abre la app
2. En la pantalla **Inicio**, desplázate hacia abajo
3. Busca la tarjeta **"🧪 Test Suite"**
4. Toca la tarjeta

### Opción B: Navegación directa
Si tienes problemas para encontrar la tarjeta, puedes navegar directamente:
- En el navegador: Agrega `/test-suite` a la URL
- En la app: Usa el router para navegar a `/test-suite`

---

## Paso 3: Ejecuta los Tests

1. Verás la pantalla **"🧪 Test Suite"**
2. Presiona el botón **"▶️ Ejecutar Tests"**
3. Espera unos segundos mientras se ejecutan
4. Verás los resultados:
   - ✅ = Test pasó
   - ❌ = Test falló

---

## Paso 4: Interpreta los Resultados

### ✅ Si todos los tests pasan:
¡Perfecto! Tu arquitectura SQLite está funcionando correctamente:
- Los Contexts se comunican bien con los Repositories
- SQLite guarda y lee datos correctamente
- La migración desde AsyncStorage funcionó

### ❌ Si algún test falla:
1. Lee el mensaje de error debajo del test
2. Abre la consola de desarrollo (en Expo presiona `j` para abrir las DevTools)
3. Busca errores en los logs
4. Revisa el código del Repository o Context correspondiente

---

## 🎯 Tests Incluidos

1. **ThemeContext: Change theme** - Valida cambio de temas
2. **WorkoutContext: Add workout** - Valida guardado de entrenamientos
3. **WorkoutContext: Add routine** - Valida guardado de rutinas
4. **ProgressContext: Update profile** - Valida actualización de perfil
5. **ProgressContext: Add entry** - Valida guardado de progreso
6. **WorkoutRepository: Fetch workouts** - Valida lectura desde SQLite

---

## 📸 Ejemplo de Resultados Esperados

```
✅ ThemeContext: Change theme
✅ WorkoutContext: Add workout
✅ WorkoutContext: Add routine
✅ ProgressContext: Update profile
✅ ProgressContext: Add entry
✅ WorkoutRepository: Fetch workouts

✅ Pasados: 6 | ❌ Fallidos: 0
```

---

## 🐛 Troubleshooting

### No veo la tarjeta "Test Suite" en Inicio
- Asegúrate de que la app se haya recargado después de los cambios
- Presiona `r` en la terminal de Expo para recargar
- O sacude el dispositivo y selecciona "Reload"

### Los tests fallan con "Cannot read property..."
- Espera a que la app cargue completamente antes de ejecutar tests
- Verifica que los Contexts estén inicializados
- Revisa los logs de consola para más detalles

### "Transaction failed" en SQLite
- Revisa los logs de consola para ver el error SQL específico
- Verifica que la base de datos se haya inicializado correctamente
- Comprueba que la migración se haya ejecutado

---

## 💡 Tips

- **Ejecuta los tests después de cada cambio importante** en Contexts o Repositories
- **Los tests crean datos de prueba** con IDs que empiezan con `test-`
- **Puedes ejecutar los tests múltiples veces** - son idempotentes
- **Revisa la consola** si algo falla - tendrás más información allí

---

## 📚 Más Información

Para detalles completos sobre el sistema de testing, consulta:
- [`TESTING.md`](file:///d:/miWeb1/fitness-app/TESTING.md) - Documentación completa
- [`app/test-suite.tsx`](file:///d:/miWeb1/fitness-app/app/test-suite.tsx) - Código fuente de los tests

---

## ✅ ¡Listo!

Ahora tienes un sistema de testing profesional que valida toda tu arquitectura SQLite. 

**Próximo paso:** Ejecuta los tests ahora mismo para confirmar que todo funciona correctamente. 🚀
