package expo.modules.screenreader

import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class ScreenReaderModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "ScreenReaderModule"
        private const val EVENT_TEXT_CAPTURED = "onTextCaptured"
    }

    private var isMonitoring = false

    override fun getName(): String = "ScreenReaderModule"

    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        try {
            val enabled = checkAccessibilityEnabled()
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun startMonitoring() {
        isMonitoring = true
        DigitalViolenceService.screenReaderModule = this
        Log.i(TAG, "🟢 Monitoreo iniciado desde JS")
    }

    @ReactMethod
    fun stopMonitoring() {
        isMonitoring = false
        DigitalViolenceService.screenReaderModule = null
        Log.i(TAG, "🔴 Monitoreo detenido desde JS")
    }

    fun sendTextEvent(text: String, appPackage: String) {
        if (!isMonitoring) return
        if (!reactContext.hasActiveReactInstance()) return

        val params = Arguments.createMap().apply {
            putString("text", text)
            putString("appPackage", appPackage)
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_TEXT_CAPTURED, params)
    }

    private fun checkAccessibilityEnabled(): Boolean {
        val serviceName = "${reactContext.packageName}/${DigitalViolenceService::class.java.canonicalName}"
        val settingValue = try {
            Settings.Secure.getString(
                reactContext.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
        } catch (e: Exception) {
            return false
        }
        if (settingValue.isNullOrEmpty()) return false

        val splitter = TextUtils.SimpleStringSplitter(':')
        splitter.setString(settingValue)
        while (splitter.hasNext()) {
            val next = splitter.next()
            if (next.equals(serviceName, ignoreCase = true)) return true
        }
        return false
    }

    // Requerido por React Native para agregar listeners de eventos
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}
