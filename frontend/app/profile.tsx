import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(280)).current;

  const sidebarItems = [
    { id: 'profile', title: 'Profile', icon: 'person' },
    { id: 'settings', title: 'Settings', icon: 'settings' },
    { id: 'alerts', title: 'Alerts', icon: 'notifications' },
    { id: 'preferences', title: 'Preferences', icon: 'options' },
    { id: 'security', title: 'Security', icon: 'shield' },
    { id: 'subscription', title: 'Subscription', icon: 'card' },
    { id: 'help', title: 'Help & Support', icon: 'help-circle' },
  ];

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');
  const [customTheme, setCustomTheme] = useState<'light' | 'dark' | 'system'>('system');

  const mockUserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100x100',
    memberSince: 'March 2023',
    subscription: 'Premium',
    totalTrades: 45,
    successRate: 78.5,
    totalProfit: 12500,
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? 0 : 280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const renderProfile = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarText}>{mockUserProfile.name.charAt(0)}</Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color={colors.tint} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>{mockUserProfile.name}</Text>
          <Text style={[styles.profileEmail, { color: colors.tabIconDefault }]}>{mockUserProfile.email}</Text>
          <View style={styles.subscriptionBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.subscriptionText}>{mockUserProfile.subscription}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.editProfileButton, { borderColor: colors.tint }]}>
          <Ionicons name="create" size={16} color={colors.tint} />
          <Text style={[styles.editProfileText, { color: colors.tint }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="swap-horizontal" size={24} color={colors.tint} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{mockUserProfile.totalTrades}</Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Total Trades</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="trending-up" size={24} color={colors.tint} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{mockUserProfile.successRate}%</Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Success Rate</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="cash" size={24} color={colors.tint} />
          <Text style={[styles.statNumber, { color: colors.text }]}>${mockUserProfile.totalProfit.toLocaleString()}</Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Total Profit</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <Ionicons name="add-circle" size={24} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.text }]}>Add Trade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <Ionicons name="analytics" size={24} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.text }]}>View Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <Ionicons name="share" size={24} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.text }]}>Share Portfolio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <Ionicons name="download" size={24} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.text }]}>Export Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={20} color={colors.tint} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}>
                {customTheme === 'system' ? 'System Default' : 
                 customTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={20} color={colors.tint} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Push Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}>Receive alerts and updates</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E0E0E0', true: colors.tint }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={20} color={colors.tint} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Language</Text>
              <Text style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}>English</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="time" size={20} color={colors.tint} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Time Zone</Text>
              <Text style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}>UTC-5 (Eastern Time)</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield" size={20} color={colors.tint} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Change Password</Text>
              <Text style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}>Update your password</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="card" size={20} color={colors.tint} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Billing & Subscription</Text>
              <Text style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}>Manage your subscription</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: '#FF6B6B' }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="log-out" size={20} color="white" />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: 'white' }]}>Sign Out</Text>
              <Text style={[styles.settingSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>Log out of your account</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return (
          <View style={styles.scrollView}>
            <Text style={[styles.placeholderText, { color: colors.text }]}>
              {sidebarItems.find(item => item.id === activeTab)?.title} - Coming Soon
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <CustomHeader 
        title={sidebarItems.find(item => item.id === activeTab)?.title || 'Profile'} 
        onMenuPress={toggleSidebar}
        leftComponent={
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create" size={24} color={colors.tint} />
          </TouchableOpacity>
        }
      />
      
      {renderContent()}

      <Sidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isVisible={sidebarVisible}
        onClose={closeSidebar}
        slideAnim={slideAnim}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  editButton: {
    padding: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8860B',
    marginLeft: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
