import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';

export default function PortfolioScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(280)).current;

  const sidebarItems = [
    { id: 'overview', title: 'Portfolio Overview', icon: 'pie-chart' },
    { id: 'holdings', title: 'Holdings', icon: 'list' },
    { id: 'watchlist', title: 'Watchlist', icon: 'eye' },
    { id: 'trades', title: 'Trade History', icon: 'swap-horizontal' },
    { id: 'performance', title: 'Performance', icon: 'trending-up' },
    { id: 'alerts', title: 'Alerts', icon: 'notifications' },
    { id: 'goals', title: 'Goals', icon: 'flag' },
  ];

  const mockPortfolioData = {
    totalValue: 24500,
    totalChange: 1250,
    totalChangePercent: 5.36,
    totalCost: 23250,
    totalGain: 1250,
    totalGainPercent: 5.36,
  };

  const mockHoldings = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      avgPrice: 150.00,
      currentPrice: 175.43,
      totalValue: 1754.30,
      totalCost: 1500.00,
      gain: 254.30,
      gainPercent: 16.95,
    },
    {
      id: '2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 5,
      avgPrice: 200.00,
      currentPrice: 248.50,
      totalValue: 1242.50,
      totalCost: 1000.00,
      gain: 242.50,
      gainPercent: 24.25,
    },
    {
      id: '3',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 3,
      avgPrice: 400.00,
      currentPrice: 485.09,
      totalValue: 1455.27,
      totalCost: 1200.00,
      gain: 255.27,
      gainPercent: 21.27,
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

  const renderHolding = ({ item }: { item: any }) => (
    <View style={[styles.holdingCard, { backgroundColor: colors.card }]}>
      <View style={styles.holdingHeader}>
        <View style={styles.stockInfo}>
          <Text style={[styles.symbol, { color: colors.text }]}>{item.symbol}</Text>
          <Text style={[styles.companyName, { color: colors.tabIconDefault }]}>{item.name}</Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={[styles.currentPrice, { color: colors.text }]}>${item.currentPrice}</Text>
          <Text style={[
            styles.gain,
            { color: item.gain >= 0 ? colors.success : colors.danger }
          ]}>
            {item.gain >= 0 ? '+' : ''}${item.gain.toFixed(2)} ({item.gainPercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      
      <View style={styles.holdingDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>Shares:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{item.shares}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>Avg Price:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>${item.avgPrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>Total Value:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>${item.totalValue.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.holdingActions}>
        <TouchableOpacity style={[styles.actionButton, { 
          backgroundColor: colors.success,
          borderColor: colors.success,
        }]}>
          <Ionicons name="add" size={16} color="white" />
          <Text style={[styles.actionButtonText, { color: 'white' }]}>Buy More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { 
          backgroundColor: 'transparent', 
          borderColor: colors.danger 
        }]}>
          <Ionicons name="remove" size={16} color={colors.danger} />
          <Text style={[styles.actionButtonText, { color: colors.danger }]}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOverview = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Portfolio Summary */}
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Portfolio Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>Total Value</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${mockPortfolioData.totalValue.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>Total Gain</Text>
            <Text style={[
              styles.summaryValue,
              { color: mockPortfolioData.totalGain >= 0 ? colors.success : colors.danger }
            ]}>
              ${mockPortfolioData.totalGain.toLocaleString()} ({mockPortfolioData.totalGainPercent.toFixed(2)}%)
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>Total Cost</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${mockPortfolioData.totalCost.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>Today's Change</Text>
            <Text style={[
              styles.summaryValue,
              { color: mockPortfolioData.totalChange >= 0 ? colors.success : colors.danger }
            ]}>
              ${mockPortfolioData.totalChange.toLocaleString()} ({mockPortfolioData.totalChangePercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>

      {/* Holdings List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Holdings</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color={colors.tint} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockHoldings}
          renderItem={renderHolding}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'holdings':
        return (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <FlatList
              data={mockHoldings}
              renderItem={renderHolding}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.holdingsList}
            />
          </ScrollView>
        );
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
        title={sidebarItems.find(item => item.id === activeTab)?.title || 'Portfolio'} 
        onMenuPress={toggleSidebar}
        leftComponent={
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color={colors.tint} />
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
  addButton: {
    padding: 4,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  holdingsList: {
    paddingBottom: 20,
  },
  holdingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  holdingHeader: {
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
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  gain: {
    fontSize: 14,
    fontWeight: '500',
  },
  holdingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  holdingActions: {
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
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
