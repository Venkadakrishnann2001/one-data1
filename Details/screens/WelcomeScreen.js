import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { BleManager } from "react-native-ble-plx";

const BluetoothScreen = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const manager = new BleManager();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      manager.destroy();
    };
  }, []);

  const handleScanToggle = () => {
    if (scanning) {
      manager.stopDeviceScan();
    } else {
      setDevices([]);
      manager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error(error);
            return;
          }
          // Add the discovered device to the list
          setDevices((prevDevices) => [...prevDevices, device]);
        }
      );
    }
    setScanning((prevScanning) => !prevScanning);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        // Handle connection to the selected device
        console.log(`Connecting to ${item.name || item.id}`);
        // Implement your connection logic here
      }}
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <Text>{item.name || "Unknown Device"}</Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={handleScanToggle}
          style={{
            padding: 16,
            backgroundColor: "blue",
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>
            {scanning ? "Stop Scanning" : "Start Scanning"}
          </Text>
        </TouchableOpacity>
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BluetoothScreen;
