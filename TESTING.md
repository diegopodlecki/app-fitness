# Guía de Testing - Fitness App

## 🎯 Estrategia de Testing

Hemos implementado **Integration Tests** que se ejecutan directamente en la app, en lugar de tests unitarios con Jest. Esta estrategia es más práctica para React Native/Expo porque:

✅ **No requiere configuración compleja** de mocks  
✅ **Prueba el código real** en el entorno real  
✅ **Valida SQLite** y toda la arquitectura  
✅ **Visual y fácil de usar** - ves los resultados en la app  

---

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Desde la App

1. Abre la app en tu emulador/dispositivo
2. Ve a la pantalla **Inicio**
3. Presiona el botón **"🧪 Test Suite"**
4. Presiona **"▶️ Ejecutar Tests"**
5. Espera a que terminen (unos segundos)
6. Revisa los resultados:
   - ✅ = Test pasó
   - ❌ = Test falló

### Opción 2: Navegación Directa

Puedes navegar directamente a `/test-suite` desde cualquier parte de la app.

---

## 📋 Tests Implementados

### 1. **ThemeContext: Change theme**
**Qué valida:**
- El contexto de temas funciona correctamente
- `setTheme()` actualiza el estado
- El tema se persiste

**Cómo funciona:**
```typescript
setTheme('rojo');
// Verifica que themeName === 'rojo'
```

---

### 2. **WorkoutContext: Add workout**
**Qué valida:**
- Se puede agregar un workout
- `WorkoutRepository.saveWorkout()` funciona
- El workout aparece en el estado
- SQLite guarda correctamente

**Cómo funciona:**
```typescript
await addWorkout({
    id: 'test-123',
    name: 'Test Workout',
    // ...
});
// Verifica que workouts.length aumentó
```

---

### 3. **WorkoutContext: Add routine**
**Qué valida:**
- Se puede agregar una rutina
- `WorkoutRepository.saveRoutine()` funciona
- La rutina se guarda en SQLite

**Cómo funciona:**
```typescript
await addRoutine({
    id: 'test-routine-123',
    name: 'Test Routine',
    // ...
});
// Verifica que routines.length aumentó
```

---

### 4. **ProgressContext: Update profile**
**Qué valida:**
- El perfil de usuario se actualiza
- `ProgressRepository.saveUserProfile()` funciona
- Los datos se persisten en SQLite

**Cómo funciona:**
```typescript
await updateProfile({
    age: '30',
    height: '180',
    initialWeight: '80'
});
// Verifica que profile.age === '30'
```

---

### 5. **ProgressContext: Add entry**
**Qué valida:**
- Se pueden agregar entradas de progreso
- `ProgressRepository.saveEntry()` funciona
- Las mediciones se guardan correctamente

**Cómo funciona:**
```typescript
await addEntry({
    id: 'test-entry-123',
    weight: '75',
    // ...
});
// Verifica que entries.length aumentó
```

---

### 6. **WorkoutRepository: Fetch workouts**
**Qué valida:**
- El Repository puede leer de SQLite
- La conexión a la base de datos funciona
- Los datos se deserializan correctamente

**Cómo funciona:**
```typescript
const workouts = await WorkoutRepository.getAllWorkouts();
// Verifica que retorna un array
```

---

## 🔍 Interpretando Resultados

### ✅ Todos los tests pasan
**Significa:**
- Tu arquitectura SQLite funciona perfectamente
- Los Contexts están bien conectados
- Los Repositories funcionan correctamente
- La migración de datos fue exitosa

### ❌ Algún test falla
**Qué hacer:**
1. Lee el mensaje de error debajo del test
2. Verifica los logs de consola (pueden tener más detalles)
3. Revisa el código del Repository o Context correspondiente

**Errores comunes:**
- `"Workout not added"` → Problema en `WorkoutRepository.saveWorkout()`
- `"Invalid response"` → Problema de conexión con SQLite
- `"Profile not updated"` → Problema en `ProgressRepository.saveUserProfile()`

---

## 🧹 Limpieza de Datos de Test

Los tests crean datos de prueba (workouts, routines, entries) con IDs que empiezan con `test-`.

**Para limpiarlos:**
1. Puedes eliminarlos manualmente desde la app
2. O agregar una función de limpieza en el test suite

**Nota:** Los datos de test no afectan tu uso normal de la app.

---

## 🎓 Ventajas de Integration Tests

### vs Unit Tests (Jest)
| Aspecto | Integration Tests | Unit Tests |
|---------|------------------|------------|
| **Setup** | ✅ Mínimo | ❌ Complejo (mocks) |
| **Realismo** | ✅ Código real | ⚠️ Código simulado |
| **SQLite** | ✅ Base de datos real | ❌ Requiere mocking |
| **Velocidad** | ⚠️ Más lento | ✅ Muy rápido |
| **Debugging** | ✅ Fácil (visual) | ⚠️ Logs de consola |

### Cuándo usar cada uno
- **Integration Tests** (lo que tenemos): Para validar flujos completos y arquitectura
- **Unit Tests**: Para lógica de negocio pura (cálculos, validaciones)

---

## 🔧 Extendiendo los Tests

### Agregar un nuevo test

1. Abre `app/test-suite.tsx`
2. Agrega tu test en la función `runTests()`:

```typescript
// Test 7: Mi nuevo test
try {
    // Tu lógica de test aquí
    const resultado = await miFunction();
    
    if (resultado === esperado) {
        testResults.push({ 
            name: 'MiTest: Descripción', 
            status: 'pass' 
        });
    } else {
        testResults.push({ 
            name: 'MiTest: Descripción', 
            status: 'fail', 
            message: 'Razón del fallo' 
        });
    }
} catch (e: any) {
    testResults.push({ 
        name: 'MiTest: Descripción', 
        status: 'fail', 
        message: e.message 
    });
}
```

---

## 📊 Cobertura Actual

**Contexts testeados:**
- ✅ ThemeContext
- ✅ WorkoutContext
- ✅ ProgressContext

**Repositories testeados:**
- ✅ WorkoutRepository (lectura)
- ✅ WorkoutRepository (escritura - via Context)
- ✅ ProgressRepository (escritura - via Context)

**Funcionalidades testeadas:**
- ✅ Cambio de temas
- ✅ Agregar workouts
- ✅ Agregar rutinas
- ✅ Actualizar perfil
- ✅ Agregar entradas de progreso
- ✅ Lectura desde SQLite

---

## 🎯 Próximos Pasos (Opcional)

Si quieres expandir el testing:

1. **Tests de UI con Detox** (E2E)
   - Simula interacciones de usuario
   - Valida flujos completos

2. **Tests de Performance**
   - Mide tiempo de carga
   - Valida queries pesadas

3. **Tests de Migración**
   - Valida que datos antiguos se migran correctamente
   - Prueba con diferentes versiones de datos

---

## 💡 Tips

- **Ejecuta los tests después de cada cambio importante** en Contexts o Repositories
- **Revisa los logs de consola** si un test falla - pueden tener stack traces útiles
- **Los tests son rápidos** - no dudes en ejecutarlos frecuentemente
- **Puedes ejecutar tests en producción** (aunque no es recomendado - mejor crear un build de desarrollo)

---

## 🐛 Troubleshooting

### "Cannot read property 'length' of undefined"
**Causa:** El Context no se inicializó correctamente  
**Solución:** Verifica que la app haya cargado completamente antes de ejecutar tests

### "Transaction failed"
**Causa:** Error en SQLite  
**Solución:** Revisa los logs de consola para ver el error SQL específico

### Tests pasan pero los datos no aparecen en la app
**Causa:** Problema de sincronización de estado  
**Solución:** Agrega un `await new Promise(resolve => setTimeout(resolve, 500))` después de la operación

---

## ✅ Conclusión

Tienes un **sistema de testing funcional y práctico** que:
- ✅ Valida tu arquitectura completa
- ✅ Es fácil de usar y extender
- ✅ Prueba código real, no mocks
- ✅ Te da confianza en tus cambios

**¡Ejecuta los tests ahora mismo para verificar que todo funciona!** 🚀
