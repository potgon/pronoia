import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';

export default function OpportunitiesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(280)).current;

  const sidebarItems = [
    { id: 'all', title: 'All Opportunities', icon: 'list' },
    { id: 'trending', title: 'Trending', icon: 'trending-up' },
    { id: 'ai-recommended', title: 'AI Recommended', icon: 'bulb' },
    { id: 'technical', title: 'Technical Analysis', icon: 'analytics' },
    { id: 'fundamental', title: 'Fundamental', icon: 'document-text' },
    { id: 'earnings', title: 'Earnings Plays', icon: 'calendar' },
    { id: 'sector', title: 'Sector Rotation', icon: 'git-branch' },
  ];

  const mockOpportunities = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.3,
      changePercent: 1.33,
      recommendation: 'Strong Buy',
      confidence: 85,
      reason: 'Strong earnings growth and new product cycle',
    },
    {
      id: '2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.50,
      change: -1.2,
      changePercent: -0.48,
      recommendation: 'Buy',
      confidence: 72,
      reason: 'EV market leadership and autonomous driving progress',
    },
    {
      id: '3',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 485.09,
      change: 8.5,
      changePercent: 1.78,
      recommendation: 'Strong Buy',
      confidence: 91,
      reason: 'AI chip dominance and gaming market growth',
    },
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

  const renderOpportunity = ({ item }: { item: any }) => (
    <View style={[styles.opportunityCard, { backgroundColor: colors.card }]}>
      <View style={styles.opportunityHeader}>
        <View style={styles.stockInfo}>
          <Text style={[styles.symbol, { color: colors.text }]}>{item.symbol}</Text>
          <Text style={[styles.companyName, { color: colors.tabIconDefault }]}>{item.name}</Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
          <Text style={[
            styles.change,
            { color: item.change >= 0 ? colors.success : colors.danger }
          ]}>
            {item.change >= 0 ? '+' : ''}{item.change} ({item.changePercent}%)
          </Text>
        </View>
      </View>
      
      <View style={styles.opportunityDetails}>
        <View style={styles.recommendationRow}>
          <Text style={[styles.recommendationLabel, { color: colors.tabIconDefault }]}>
            Recommendation:
          </Text>
          <Text style={[styles.recommendation, { color: colors.tint }]}>
            {item.recommendation}
          </Text>
        </View>
        
        <View style={styles.confidenceRow}>
          <Text style={[styles.confidenceLabel, { color: colors.tabIconDefault }]}>
            Confidence:
          </Text>
          <View style={styles.confidenceBar}>
            <View 
              style={[
                styles.confidenceFill, 
                { 
                  width: `${item.confidence}%`,
                  backgroundColor: item.confidence > 80 ? colors.success : 
                                   item.confidence > 60 ? colors.warning : colors.danger
                }
              ]} 
            />
          </View>
          <Text style={[styles.confidenceText, { color: colors.text }]}>
            {item.confidence}%
          </Text>
        </View>
        
        <Text style={[styles.reason, { color: colors.tabIconDefault }]}>
          {item.reason}
        </Text>
      </View>
      
      <View style={styles.opportunityActions}>
        <TouchableOpacity style={[styles.actionButton, { 
          backgroundColor: colors.success,
          borderColor: colors.success,
        }]}>
          <Ionicons name="add" size={16} color="white" />
          <Text style={[styles.actionButtonText, { color: 'white' }]}>Add to Watchlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { 
          backgroundColor: 'transparent', 
          borderColor: colors.tint 
        }]}>
          <Ionicons name="analytics" size={16} color={colors.tint} />
          <Text style={[styles.actionButtonText, { color: colors.tint }]}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <CustomHeader 
        title={sidebarItems.find(item => item.id === activeTab)?.title || 'Opportunities'} 
        onMenuPress={toggleSidebar}
        leftComponent={
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color={colors.tint} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <FlatList
          data={mockOpportunities}
          renderItem={renderOpportunity}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.opportunitiesList}
        />
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
  filterButton: {
    padding: 4,
  },
  opportunitiesList: {
    paddingBottom: 20,
  },
  opportunityCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  opportunityDetails: {
    marginBottom: 16,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  recommendation: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 30,
  },
  reason: {
    fontSize: 14,
    lineHeight: 20,
  },
  opportunityActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});
