#!/usr/bin/env python3
"""
EmailCraft Pro Backend Authentication Testing Suite
Tests the complete authentication flow with Appwrite integration
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3001/api"
HEADERS = {"Content-Type": "application/json"}

class AuthenticationTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = []
        self.test_user_email = f"testuser_{uuid.uuid4().hex[:8]}@emailcraft.test"
        self.test_user_password = "SecurePassword123!"
        self.test_user_name = "Test User"
        self.auth_token = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_health_check(self):
        """Test if the server is running"""
        try:
            response = requests.get(f"{self.base_url.replace('/api', '')}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test("Health Check", True, f"Server is running - Status: {data.get('status')}", data)
                return True
            else:
                self.log_test("Health Check", False, f"Server returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check", False, f"Server connection failed: {str(e)}")
            return False
    
    def test_register_user(self):
        """Test user registration with Appwrite"""
        try:
            payload = {
                "name": self.test_user_name,
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=payload,
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 201:
                data = response.json()
                if "token" in data and "user" in data:
                    self.auth_token = data["token"]
                    user = data["user"]
                    if user["email"] == self.test_user_email and user["name"] == self.test_user_name:
                        self.log_test("User Registration", True, "User registered successfully with JWT token", {
                            "user_id": user["id"],
                            "email": user["email"],
                            "name": user["name"],
                            "has_token": bool(data["token"])
                        })
                        return True
                    else:
                        self.log_test("User Registration", False, "User data mismatch in response", data)
                        return False
                else:
                    self.log_test("User Registration", False, "Missing token or user in response", data)
                    return False
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("User Registration", False, f"Registration failed with status {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Registration", False, f"Network error during registration: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("User Registration", False, f"Invalid JSON response: {str(e)}")
            return False
    
    def test_login_user(self):
        """Test user login with valid credentials"""
        try:
            payload = {
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=payload,
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.auth_token = data["token"]  # Update token from login
                    user = data["user"]
                    if user["email"] == self.test_user_email:
                        self.log_test("User Login", True, "Login successful with JWT token", {
                            "user_id": user["id"],
                            "email": user["email"],
                            "name": user["name"],
                            "has_token": bool(data["token"])
                        })
                        return True
                    else:
                        self.log_test("User Login", False, "User email mismatch in login response", data)
                        return False
                else:
                    self.log_test("User Login", False, "Missing token or user in login response", data)
                    return False
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("User Login", False, f"Login failed with status {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Login", False, f"Network error during login: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("User Login", False, f"Invalid JSON response during login: {str(e)}")
            return False
    
    def test_token_validation(self):
        """Test JWT token validation with /me endpoint"""
        if not self.auth_token:
            self.log_test("Token Validation", False, "No auth token available for validation")
            return False
            
        try:
            auth_headers = {
                **self.headers,
                "Authorization": f"Bearer {self.auth_token}"
            }
            
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers=auth_headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data:
                    user = data["user"]
                    if user["email"] == self.test_user_email:
                        self.log_test("Token Validation", True, "JWT token validated successfully", {
                            "user_id": user["id"],
                            "email": user["email"],
                            "name": user["name"]
                        })
                        return True
                    else:
                        self.log_test("Token Validation", False, "User email mismatch in token validation", data)
                        return False
                else:
                    self.log_test("Token Validation", False, "Missing user in token validation response", data)
                    return False
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Token Validation", False, f"Token validation failed with status {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Token Validation", False, f"Network error during token validation: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Token Validation", False, f"Invalid JSON response during token validation: {str(e)}")
            return False
    
    def test_invalid_credentials_login(self):
        """Test login with invalid credentials - should return 401 with 'Invalid email or password'"""
        try:
            payload = {
                "email": "nonexistent@emailcraft.test",
                "password": "WrongPassword123!"
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=payload,
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 401:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                expected_error = "Invalid email or password"
                actual_error = data.get("error", "")
                
                if expected_error in actual_error:
                    self.log_test("Invalid Credentials Login", True, f"Correctly rejected invalid credentials with proper error message: '{actual_error}'", {
                        "status_code": response.status_code,
                        "error_message": actual_error
                    })
                    return True
                else:
                    self.log_test("Invalid Credentials Login", False, f"Got 401 but wrong error message. Expected: '{expected_error}', Got: '{actual_error}'", data)
                    return False
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Invalid Credentials Login", False, f"Expected 401 but got {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Credentials Login", False, f"Network error during invalid login test: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Invalid Credentials Login", False, f"Invalid JSON response during invalid login test: {str(e)}")
            return False
    
    def test_duplicate_email_registration(self):
        """Test registration with duplicate email"""
        try:
            payload = {
                "name": "Another Test User",
                "email": self.test_user_email,  # Same email as before
                "password": "AnotherPassword123!"
            }
            
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=payload,
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 409:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Duplicate Email Registration", True, "Correctly rejected duplicate email", {
                    "status_code": response.status_code,
                    "error_message": data.get("error", "No error message")
                })
                return True
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Duplicate Email Registration", False, f"Expected 409 but got {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Duplicate Email Registration", False, f"Network error during duplicate email test: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Duplicate Email Registration", False, f"Invalid JSON response during duplicate email test: {str(e)}")
            return False
    
    def test_invalid_token_access(self):
        """Test access with invalid JWT token"""
        try:
            auth_headers = {
                **self.headers,
                "Authorization": "Bearer invalid_token_here"
            }
            
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers=auth_headers,
                timeout=15
            )
            
            if response.status_code in [401, 403]:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Invalid Token Access", True, "Correctly rejected invalid token", {
                    "status_code": response.status_code,
                    "error_message": data.get("error", "No error message")
                })
                return True
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Invalid Token Access", False, f"Expected 401/403 but got {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Token Access", False, f"Network error during invalid token test: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Invalid Token Access", False, f"Invalid JSON response during invalid token test: {str(e)}")
            return False
    
    def test_missing_token_access(self):
        """Test access without JWT token"""
        try:
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers=self.headers,  # No Authorization header
                timeout=15
            )
            
            if response.status_code == 401:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Missing Token Access", True, "Correctly rejected missing token", {
                    "status_code": response.status_code,
                    "error_message": data.get("error", "No error message")
                })
                return True
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Missing Token Access", False, f"Expected 401 but got {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Missing Token Access", False, f"Network error during missing token test: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Missing Token Access", False, f"Invalid JSON response during missing token test: {str(e)}")
            return False
    
    def test_forgot_password(self):
        """Test forgot password endpoint - should return success message regardless of email existence"""
        try:
            # Test with existing email
            payload = {"email": self.test_user_email}
            
            response = requests.post(
                f"{self.base_url}/auth/forgot-password",
                json=payload,
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                expected_message = "If an account with this email exists, you will receive a password reset link shortly."
                actual_message = data.get("message", "")
                
                if expected_message in actual_message:
                    self.log_test("Forgot Password (Existing Email)", True, f"Correctly returned success message: '{actual_message}'", {
                        "status_code": response.status_code,
                        "message": actual_message
                    })
                    
                    # Test with non-existing email - should return same message
                    payload_nonexistent = {"email": "nonexistent@emailcraft.test"}
                    response_nonexistent = requests.post(
                        f"{self.base_url}/auth/forgot-password",
                        json=payload_nonexistent,
                        headers=self.headers,
                        timeout=15
                    )
                    
                    if response_nonexistent.status_code == 200:
                        data_nonexistent = response_nonexistent.json()
                        actual_message_nonexistent = data_nonexistent.get("message", "")
                        
                        if expected_message in actual_message_nonexistent:
                            self.log_test("Forgot Password (Non-existing Email)", True, f"Correctly returned same success message for security: '{actual_message_nonexistent}'", {
                                "status_code": response_nonexistent.status_code,
                                "message": actual_message_nonexistent
                            })
                            return True
                        else:
                            self.log_test("Forgot Password (Non-existing Email)", False, f"Wrong message for non-existing email. Expected: '{expected_message}', Got: '{actual_message_nonexistent}'", data_nonexistent)
                            return False
                    else:
                        data_nonexistent = response_nonexistent.json() if response_nonexistent.headers.get('content-type', '').startswith('application/json') else {"error": response_nonexistent.text}
                        self.log_test("Forgot Password (Non-existing Email)", False, f"Expected 200 but got {response_nonexistent.status_code}", data_nonexistent)
                        return False
                else:
                    self.log_test("Forgot Password (Existing Email)", False, f"Wrong message format. Expected: '{expected_message}', Got: '{actual_message}'", data)
                    return False
            else:
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                self.log_test("Forgot Password (Existing Email)", False, f"Expected 200 but got {response.status_code}", data)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Forgot Password", False, f"Network error during forgot password test: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Forgot Password", False, f"Invalid JSON response during forgot password test: {str(e)}")
            return False
    
    def test_reset_password_validation(self):
        """Test reset password endpoint validation - should validate required parameters"""
        try:
            # Test with missing parameters
            test_cases = [
                {"payload": {}, "expected_error": "User ID, secret, and new password are required"},
                {"payload": {"userId": "test"}, "expected_error": "User ID, secret, and new password are required"},
                {"payload": {"userId": "test", "secret": "test"}, "expected_error": "User ID, secret, and new password are required"},
                {"payload": {"userId": "test", "secret": "test", "password": "123"}, "expected_error": "Password must be at least 6 characters long"},
            ]
            
            all_passed = True
            for i, test_case in enumerate(test_cases):
                response = requests.post(
                    f"{self.base_url}/auth/reset-password",
                    json=test_case["payload"],
                    headers=self.headers,
                    timeout=15
                )
                
                if response.status_code == 400:
                    data = response.json()
                    actual_error = data.get("error", "")
                    expected_error = test_case["expected_error"]
                    
                    if expected_error in actual_error:
                        self.log_test(f"Reset Password Validation {i+1}", True, f"Correctly validated parameters: '{actual_error}'", {
                            "status_code": response.status_code,
                            "error_message": actual_error,
                            "test_payload": test_case["payload"]
                        })
                    else:
                        self.log_test(f"Reset Password Validation {i+1}", False, f"Wrong validation message. Expected: '{expected_error}', Got: '{actual_error}'", data)
                        all_passed = False
                else:
                    data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"error": response.text}
                    self.log_test(f"Reset Password Validation {i+1}", False, f"Expected 400 but got {response.status_code}", data)
                    all_passed = False
            
            return all_passed
                
        except requests.exceptions.RequestException as e:
            self.log_test("Reset Password Validation", False, f"Network error during reset password validation test: {str(e)}")
            return False
        except json.JSONDecodeError as e:
            self.log_test("Reset Password Validation", False, f"Invalid JSON response during reset password validation test: {str(e)}")
            return False
        """Test CORS configuration"""
        try:
            response = requests.options(
                f"{self.base_url}/auth/login",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Content-Type"
                },
                timeout=10
            )
            
            cors_headers = {
                "access-control-allow-origin": response.headers.get("access-control-allow-origin"),
                "access-control-allow-methods": response.headers.get("access-control-allow-methods"),
                "access-control-allow-headers": response.headers.get("access-control-allow-headers"),
                "access-control-allow-credentials": response.headers.get("access-control-allow-credentials")
            }
            
            if response.status_code in [200, 204] and cors_headers["access-control-allow-origin"]:
                self.log_test("CORS Configuration", True, "CORS headers properly configured", cors_headers)
                return True
            else:
                self.log_test("CORS Configuration", False, f"CORS preflight failed with status {response.status_code}", cors_headers)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"Network error during CORS test: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting EmailCraft Pro Authentication Tests")
        print("=" * 60)
        
        # Test server connectivity first
        if not self.test_health_check():
            print("\n❌ Server is not running. Please start the backend server first.")
            return False
        
        print(f"\n📧 Testing with user: {self.test_user_email}")
        print("-" * 60)
        
        # Core authentication flow tests
        tests = [
            self.test_register_user,
            self.test_login_user,
            self.test_token_validation,
            self.test_invalid_credentials_login,
            self.test_forgot_password,
            self.test_reset_password_validation,
            self.test_duplicate_email_registration,
            self.test_invalid_token_access,
            self.test_missing_token_access
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                self.log_test(test.__name__, False, f"Test execution error: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All authentication tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) FAILED")
            return False
    
    def get_summary(self):
        """Get test summary"""
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        summary = {
            "total_tests": total,
            "passed": passed,
            "failed": total - passed,
            "success_rate": f"{(passed/total*100):.1f}%" if total > 0 else "0%",
            "test_user_email": self.test_user_email,
            "timestamp": datetime.now().isoformat(),
            "results": self.test_results
        }
        
        return summary

def main():
    """Main test execution"""
    tester = AuthenticationTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    summary = tester.get_summary()
    with open('/app/auth_test_results.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/auth_test_results.json")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)