import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(280)).current;

  const sidebarItems = [
    { id: 'overview', title: 'Overview', icon: 'home' },
    { id: 'quick-actions', title: 'Quick Actions', icon: 'flash' },
    { id: 'recent-activity', title: 'Recent Activity', icon: 'time' },
    { id: 'favorites', title: 'Favorites', icon: 'heart' },
    { id: 'settings', title: 'Settings', icon: 'settings' },
  ];

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <CustomHeader 
        title="Pronoia" 
        onMenuPress={toggleSidebar}
        leftComponent={
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.tint} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="trending-up" size={24} color={colors.tint} />
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Active Opportunities</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="pie-chart" size={24} color={colors.tint} />
            <Text style={[styles.statNumber, { color: colors.text }]}>$24.5K</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Portfolio Value</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
              <Ionicons name="search" size={24} color={colors.tint} />
              <Text style={[styles.actionText, { color: colors.text }]}>Find Stocks</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
              <Ionicons name="notifications" size={24} color={colors.tint} />
              <Text style={[styles.actionText, { color: colors.text }]}>Alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
              <Ionicons name="newspaper" size={24} color={colors.tint} />
              <Text style={[styles.actionText, { color: colors.text }]}>News</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
              <Ionicons name="analytics" size={24} color={colors.tint} />
              <Text style={[styles.actionText, { color: colors.text }]}>Analysis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
            <View style={styles.activityItem}>
              <Ionicons name="arrow-up" size={16} color={colors.success} />
              <Text style={[styles.activityText, { color: colors.text }]}>
                AAPL gained 2.3% - New opportunity detected
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="notifications" size={16} color={colors.tint} />
              <Text style={[styles.activityText, { color: colors.text }]}>
                Earnings alert: TSLA reports tomorrow
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="trending-down" size={16} color={colors.danger} />
              <Text style={[styles.activityText, { color: colors.text }]}>
                NVDA dropped 1.8% - Consider position
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
  notificationButton: {
    padding: 4,
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
    fontSize: 24,
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
  activityCard: {
    padding: 16,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
});
