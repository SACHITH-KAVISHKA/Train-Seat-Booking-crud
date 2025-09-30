# 🔧 IntelliJ IDEA Lombok Fix Guide

## ❌ **Error:**
```
java.lang.NoSuchFieldError: Class com.sun.tools.javac.tree.JCTree$JCImport does not have member field 'com.sun.tools.javac.tree.JCTree qualid'
```

## ✅ **Step-by-Step Solution:**

### **Step 1: Install Lombok Plugin**
1. Open IntelliJ IDEA
2. Go to `File` → `Settings` (or `Ctrl+Alt+S`)
3. Navigate to `Plugins`
4. Search for "Lombok"
5. Install the Lombok plugin if not already installed
6. **Restart IntelliJ IDEA**

### **Step 2: Enable Annotation Processing**
1. Go to `File` → `Settings` (or `Ctrl+Alt+S`)
2. Navigate to `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
3. **Check "Enable annotation processing"**
4. **Select "Obtain processors from project classpath"**
5. Click `Apply` and `OK`

### **Step 3: Set Project SDK to Java 17**
1. Go to `File` → `Project Structure` (or `Ctrl+Alt+Shift+S`)
2. Under `Project Settings` → `Project`
3. Set **Project SDK** to Java 17 or higher
4. Set **Project language level** to 17
5. Click `Apply` and `OK`

### **Step 4: Set Module SDK**
1. Still in `Project Structure`
2. Go to `Modules` → Select your module
3. Set **Module SDK** to Project SDK (Java 17)
4. Click `Apply` and `OK`

### **Step 5: Refresh Maven Project**
1. Open Maven tool window (View → Tool Windows → Maven)
2. Click the refresh button (🔄) to reload the project
3. Or right-click on `pom.xml` → `Maven` → `Reload project`

### **Step 6: Clean and Rebuild**
1. Go to `Build` → `Clean`
2. After cleaning, go to `Build` → `Rebuild Project`

### **Step 7: Invalidate Caches (if still not working)**
1. Go to `File` → `Invalidate Caches and Restart`
2. Select `Invalidate and Restart`

## 🎯 **Alternative: Run from Terminal (Guaranteed to Work)**

If IntelliJ still has issues, you can always run from terminal:

```bash
# Clean and compile
mvn clean compile

# Run the application
mvn spring-boot:run
```

The application will work from terminal even if IntelliJ has annotation processing issues.

## ✅ **Verification:**

After following these steps:
1. Try building the project in IntelliJ (`Ctrl+F9`)
2. Look for any remaining compilation errors
3. Run the main application class `TrainBookingSystemApplication`

## 🚀 **Application URLs (Once Running):**
- **Health Check**: http://localhost:8080/api/health
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/api-docs

---

**Note**: The application already runs successfully from the terminal, so this is purely an IntelliJ IDE configuration issue!