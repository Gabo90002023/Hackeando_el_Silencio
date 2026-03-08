package expo.modules.screenreader

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class DigitalViolenceService : AccessibilityService() {

    companion object {
        private const val TAG = "DigitalViolenceService"
        var screenReaderModule: ScreenReaderModule? = null
        private val seenLinesByApp = HashMap<String, LinkedHashMap<String, Long>>()
        private const val LINE_SEEN_MS = 60_000L
        private const val MAX_LINES_PER_APP = 400
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        val info = AccessibilityServiceInfo().apply {
            eventTypes = (
                AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED or
                AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED or
                AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED
            )
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = (
                AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS or
                AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS or
                AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            )
            notificationTimeout = 50
        }
        serviceInfo = info
        Log.i(TAG, "✅ DigitalViolenceService conectado")
    }

    private val ignoredPackages = setOf(
        "com.anonymous.alerta_violencia",
        "com.google.android.inputmethod.latin",
        "com.samsung.android.honeyboard",
        "com.swiftkey.swiftkeyapp",
        "com.touchtype.swiftkey",
        "com.google.android.inputmethod.korean",
        "com.android.systemui",
        "com.android.launcher3",
        "com.google.android.apps.nexuslauncher",
        "com.sec.android.app.launcher"
    )

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return
        val appPackage = event.packageName?.toString() ?: return
        if (appPackage in ignoredPackages) return
        if (appPackage.contains("inputmethod") || appPackage.contains("keyboard") ||
            appPackage.contains("ime.") || appPackage.endsWith(".ime")) return

        when (event.eventType) {
            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
                val src = event.source
                val text = if (src != null) {
                    val t = extractAllText(src)
                    src.recycle()
                    t
                } else {
                    event.text.joinToString(" ") { it.toString() }
                }
                if (text.isNotBlank()) sendNewLines(appPackage, text)
            }

            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED,
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                val root = rootInActiveWindow ?: return
                val text = extractAllText(root)
                root.recycle()
                if (text.isNotBlank()) sendNewLines(appPackage, text)
            }

            AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED -> {
                val text = event.text.joinToString(" ") { it.toString() }
                if (text.isNotBlank()) sendNewLines(appPackage, text)
            }
        }
    }

    private fun sendNewLines(appPackage: String, allText: String) {
        val now = System.currentTimeMillis()
        val seenLines = seenLinesByApp.getOrPut(appPackage) {
            object : LinkedHashMap<String, Long>() {
                override fun removeEldestEntry(eldest: Map.Entry<String, Long>?) =
                    size > MAX_LINES_PER_APP
            }
        }
        seenLines.entries.removeIf { (_, t) -> now - t > LINE_SEEN_MS }

        val allLines = allText.split('\n').map { it.trim() }.filter { it.length >= 3 }
        val newLines = allLines.filter { !seenLines.containsKey(it) }

        if (newLines.isEmpty()) return

        allLines.forEach { seenLines[it] = now }

        val output = newLines.joinToString("\n")
        screenReaderModule?.sendTextEvent(output, appPackage)
    }

    override fun onInterrupt() { Log.w(TAG, "⚠️ Servicio interrumpido") }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "🔴 Servicio destruido")
        screenReaderModule = null
        seenLinesByApp.clear()
    }

    private fun extractAllText(node: AccessibilityNodeInfo?): String {
        node ?: return ""
        val sb = StringBuilder()
        extractTextRecursive(node, sb, 0)
        return sb.toString().trim()
    }

    private fun extractTextRecursive(node: AccessibilityNodeInfo, sb: StringBuilder, depth: Int) {
        if (depth > 35) return
        node.text?.toString()?.takeIf { it.isNotBlank() }?.let { sb.append(it).append('\n') }
        node.contentDescription?.toString()?.takeIf {
            it.isNotBlank() && it != node.text?.toString()
        }?.let { sb.append(it).append('\n') }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            extractTextRecursive(child, sb, depth + 1)
            child.recycle()
        }
    }
}


    override fun onServiceConnected() {
        super.onServiceConnected()
        val info = AccessibilityServiceInfo().apply {
            eventTypes = (
                AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED        or  // texto editado
                AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED   or  // nuevo elemento en lista (mensajes)
                AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED     or  // cambio de pantalla
                AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED   // notificaciones entrantes
            )
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = (
                AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS             or
                AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS or
                AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            )
            notificationTimeout = 50
        }
        serviceInfo = info
        Log.i(TAG, "✅ DigitalViolenceService conectado")
    }

    // Paquetes que no aportan información relevante (teclado, sistema, etc.)
    private val ignoredPackages = setOf(
        "com.anonymous.alerta_violencia",
        "com.google.android.inputmethod.latin",
        "com.samsung.android.honeyboard",
        "com.swiftkey.swiftkeyapp",
        "com.touchtype.swiftkey",
        "com.google.android.inputmethod.korean",
        "com.android.systemui",
        "com.android.launcher3",
        "com.google.android.apps.nexuslauncher",
        "com.sec.android.app.launcher"
    )

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return
        val appPackage = event.packageName?.toString() ?: return
        if (appPackage in ignoredPackages) return
        // Ignorar cualquier teclado/IME genérico
        if (appPackage.contains("inputmethod") || appPackage.contains("keyboard") ||
            appPackage.contains("ime.") || appPackage.endsWith(".ime")) return

        when (event.eventType) {

            // Usuario escribiendo: solo capturamos ese campo de texto específico
            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
                val src = event.source
                val text = if (src != null) {
                    val t = extractAllText(src)
                    src.recycle()
                    t
                } else {
                    event.text.joinToString(" ") { it.toString() }
                }
                if (text.isNotBlank()) sendNewLines(appPackage, text)
            }

            // Contenido cambia O cambio de pantalla: leemos TODO rootInActiveWindow
            // y solo emitimos las líneas que no se habían visto antes.
            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED,
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                val root = rootInActiveWindow ?: return
                val text = extractAllText(root)
                root.recycle()
                if (text.isNotBlank()) sendNewLines(appPackage, text)
            }

            // Notificación entrante (app en segundo plano)
            AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED -> {
                val text = event.text.joinToString(" ") { it.toString() }
                if (text.isNotBlank()) sendNewLines(appPackage, text)
            }
        }
    }

    /**
     * Divide el texto capturado en líneas, filtra las ya vistas recientemente
     * y emite SOLO las líneas nuevas. Así siempre se lee toda la pantalla pero
     * nunca se re-envían mensajes que ya aparecían en eventos anteriores.
     */
    private fun sendNewLines(appPackage: String, allText: String) {
        val now = System.currentTimeMillis()
        val seenLines = seenLinesByApp.getOrPut(appPackage) {
            object : LinkedHashMap<String, Long>() {
                override fun removeEldestEntry(eldest: Map.Entry<String, Long>?) =
                    size > MAX_LINES_PER_APP
            }
        }
        // Expirar entradas viejas
        seenLines.entries.removeIf { (_, t) -> now - t > LINE_SEEN_MS }

        val allLines = allText.split('\n').map { it.trim() }.filter { it.length >= 3 }

        // Líneas que no se han emitido aún
        val newLines = allLines.filter { !seenLines.containsKey(it) }

        if (newLines.isEmpty()) return

        // Marcar TODAS las líneas de la pantalla como vistas (nuevas y viejas)
        // para que el próximo evento solo muestre lo verdaderamente nuevo
        allLines.forEach { seenLines[it] = now }

        val output = newLines.joinToString("\n")
        //Log.i(TAG, output)
        screenReaderModule?.sendTextEvent(output, appPackage)
    }

    override fun onInterrupt() { Log.w(TAG, "⚠️ Servicio interrumpido") }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "🔴 Servicio destruido")
        screenReaderModule = null
        seenLinesByApp.clear()
    }

    private fun extractAllText(node: AccessibilityNodeInfo?): String {
        node ?: return ""
        val sb = StringBuilder()
        extractTextRecursive(node, sb, 0)
        return sb.toString().trim()
    }

    private fun extractTextRecursive(node: AccessibilityNodeInfo, sb: StringBuilder, depth: Int) {
        if (depth > 35) return

        node.text?.toString()?.takeIf { it.isNotBlank() }?.let { sb.append(it).append('\n') }
        node.contentDescription?.toString()?.takeIf {
            it.isNotBlank() && it != node.text?.toString()
        }?.let { sb.append(it).append('\n') }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            extractTextRecursive(child, sb, depth + 1)
            child.recycle()
        }
    }
}
