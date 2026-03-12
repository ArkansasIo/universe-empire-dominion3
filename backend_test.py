import requests
import sys
import json
from datetime import datetime

class StellarDominionAPITester:
    def __init__(self, base_url="https://26f3f83a-f4af-4064-a1b4-5797c1417aeb.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=15, use_auth=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}
        
        # Add auth header if needed
        if use_auth and self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if data:
            print(f"   Data: {json.dumps(data, indent=2)[:200]}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:300]}...")
                    return success, response_data
                except:
                    print(f"   Response: {response.text[:200]}...")
                    return success, response.text
            else:
                self.failed_tests.append({
                    "name": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")
                return success, None

        except requests.exceptions.Timeout:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": "Timeout"
            })
            print(f"❌ Failed - Request timeout")
            return False, None
        except requests.exceptions.ConnectionError as e:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": f"Connection error: {str(e)}"
            })
            print(f"❌ Failed - Connection error: {str(e)}")
            return False, None
        except Exception as e:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_health_endpoints(self):
        """Test health and status endpoints"""
        print("\n🔧 Testing Health Endpoints...")
        
        # Test basic health
        self.run_test("Root Health Check", "GET", "health", 200)
        
        # Test API health
        self.run_test("API Health Check", "GET", "api/health", 200)
        
        # Test API status
        self.run_test("API Status Check", "GET", "api/status", 200)

    def test_auth_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test user registration
        register_data = {"username": "testuser2", "password": "testpass123"}
        success, response = self.run_test("User Registration", "POST", "api/auth/register", 200, register_data)
        
        if success and response:
            print(f"✅ Registration successful. User ID: {response.get('userId')}")
            self.user_id = response.get('userId')
            self.session_token = response.get('token')
        
        # Test user login
        login_data = {"username": "testuser2", "password": "testpass123"}
        success, response = self.run_test("User Login", "POST", "api/auth/login", 200, login_data)
        
        if success and response:
            print(f"✅ Login successful. Session token set.")
            self.user_id = response.get('userId')
            self.session_token = response.get('token')
        
        # Test auth user endpoint
        self.run_test("Get Auth User", "GET", "api/auth/user", 200, use_auth=True)
        
        # Test get current user
        self.run_test("Get Current User Info", "GET", "api/auth/me", 200, use_auth=True)

    def test_player_setup(self):
        """Test player setup flow"""
        print("\n👤 Testing Player Setup...")
        
        if not self.session_token:
            print("❌ Skipping player setup - no session token")
            return
        
        # Test player setup
        setup_data = {
            "planetName": "Test Colony",
            "commanderType": "militarist",
            "governmentType": "democracy",
            "faction": "terran"
        }
        success, response = self.run_test("Player Setup", "POST", "api/player/setup", 200, setup_data, use_auth=True)
        
        if success:
            print(f"✅ Player setup completed successfully")

    def test_game_state(self):
        """Test game state endpoints"""
        print("\n🎮 Testing Game State...")
        
        if not self.session_token:
            print("❌ Skipping game state tests - no session token")
            return
        
        # Test get player state
        self.run_test("Get Player State", "GET", "api/player/state", 200, use_auth=True)
        
        # Test get game state
        self.run_test("Get Game State", "GET", "api/game/state", 200, use_auth=True)

    def test_buildings_system(self):
        """Test buildings system"""
        print("\n🏗️ Testing Buildings System...")
        
        if not self.session_token:
            print("❌ Skipping buildings tests - no session token")
            return
        
        # Test get building costs
        self.run_test("Get Building Costs", "GET", "api/buildings/costs", 200, use_auth=True)
        
        # Test building upgrade
        upgrade_data = {"buildingType": "metalMine"}
        success, response = self.run_test("Upgrade Building", "POST", "api/buildings/upgrade", 200, upgrade_data, use_auth=True)
        
        if success:
            print(f"✅ Building upgrade successful")

    def test_research_system(self):
        """Test research system"""
        print("\n🔬 Testing Research System...")
        
        if not self.session_token:
            print("❌ Skipping research tests - no session token")
            return
        
        # Test get available research
        self.run_test("Get Available Research", "GET", "api/research/available", 200, use_auth=True)
        
        # Test start research
        research_data = {"techId": "energyTechnology"}
        success, response = self.run_test("Start Research", "POST", "api/research/start", 200, research_data, use_auth=True)
        
        if success:
            print(f"✅ Research started successfully")

    def test_shipyard_system(self):
        """Test shipyard system"""
        print("\n🚀 Testing Shipyard System...")
        
        if not self.session_token:
            print("❌ Skipping shipyard tests - no session token")
            return
        
        # Test get available ships
        self.run_test("Get Available Ships", "GET", "api/shipyard/available", 200, use_auth=True)
        
        # Test build ships
        ship_data = {"shipType": "lightFighter", "quantity": 1}
        success, response = self.run_test("Build Ships", "POST", "api/shipyard/build", 200, ship_data, use_auth=True)
        
        if success:
            print(f"✅ Ship building successful")

    def test_galaxy_system(self):
        """Test galaxy system"""
        print("\n🌌 Testing Galaxy System...")
        
        if not self.session_token:
            print("❌ Skipping galaxy tests - no session token")
            return
        
        # Test galaxy view
        self.run_test("Get Galaxy View", "GET", "api/galaxy/1/1", 200, use_auth=True)
        
        # Test universe overview
        self.run_test("Get Universe Overview", "GET", "api/universe/overview", 200, use_auth=True)

    def test_leaderboard(self):
        """Test leaderboard system"""
        print("\n🏆 Testing Leaderboard System...")
        
        if not self.session_token:
            print("❌ Skipping leaderboard tests - no session token")
            return
        
        # Test leaderboard
        self.run_test("Get Leaderboard", "GET", "api/leaderboard", 200, use_auth=True)

    def test_additional_systems(self):
        """Test additional game systems"""
        print("\n🔧 Testing Additional Systems...")
        
        if not self.session_token:
            print("❌ Skipping additional tests - no session token")
            return
        
        # Test messages
        self.run_test("Get Messages", "GET", "api/messages", 200, use_auth=True)
        
        # Test alliances
        self.run_test("Get My Alliance", "GET", "api/alliances/my", 200, use_auth=True)
        
        # Test market orders
        self.run_test("Get Market Orders", "GET", "api/market/orders", 200, use_auth=True)
        
        # Test diagnostics
        self.run_test("Get Diagnostics", "GET", "api/diagnostics", 200, use_auth=True)
        
        # Test settings
        self.run_test("Get Settings", "GET", "api/settings", 200, use_auth=True)

def main():
    print("🚀 Starting Stellar Dominion FastAPI Backend Tests...")
    print("=" * 70)
    
    # Setup
    tester = StellarDominionAPITester()
    
    # Test health endpoints
    tester.test_health_endpoints()
    
    # Test authentication flow
    tester.test_auth_flow()
    
    # Test player setup
    tester.test_player_setup()
    
    # Test game state
    tester.test_game_state()
    
    # Test buildings system  
    tester.test_buildings_system()
    
    # Test research system
    tester.test_research_system()
    
    # Test shipyard system
    tester.test_shipyard_system()
    
    # Test galaxy system
    tester.test_galaxy_system()
    
    # Test leaderboard
    tester.test_leaderboard()
    
    # Test additional systems
    tester.test_additional_systems()

    # Print results
    print("\n" + "=" * 70)
    print(f"📊 Final Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests Details:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"  - {test['name']}: {error_msg}")
            if 'response' in test:
                print(f"    Response: {test['response'][:200]}...")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Backend tests mostly successful!")
    elif success_rate >= 50:
        print("⚠️  Backend has some issues but core functionality works")
    else:
        print("🚨 Backend has significant issues")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())