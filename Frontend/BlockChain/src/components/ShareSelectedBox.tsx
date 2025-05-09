import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {APP_COLOR} from '../utils/constant';

const styles = StyleSheet.create({
  container: {
    padding: 5,
    gap: 10,
  },
  selectBox: {
    backgroundColor: APP_COLOR.GREY,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: '#888',
  },
  value: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_COLOR.PRIMARY,
  },
  closeButton: {
    padding: 5,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginHorizontal: 8,
  },
  arrowIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});

interface Option {
  id: number | string;
  name: string;
}

interface ShareSelectProps {
  title: string;
  options: Option[];
  selectedId?: number | string;
  onSelect: (value: number | string) => void;
  errors?: string;
  displayProperty?: keyof Option;
  valueProperty?: keyof Option;
}

const ShareSelect = ({
  title,
  options,
  selectedId,
  onSelect,
  errors,
  displayProperty = 'name',
  valueProperty = 'id',
}: ShareSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(
    option => option[valueProperty] === selectedId,
  );

  const handleOpenModal = () => {
    setModalVisible(true);
    setIsFocused(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsFocused(false);
  };

  const handleSelectOption = (option: Option) => {
    onSelect(option[valueProperty] as number | string);
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selectBox,
          {borderColor: isFocused ? APP_COLOR.PRIMARY : '#CCC9C9'},
        ]}
        onPress={handleOpenModal}
        activeOpacity={0.7}>
        <Text style={selectedOption ? styles.value : styles.placeholder}>
          {selectedOption ? (selectedOption[displayProperty] as string) : title}
        </Text>
        {/* <Image
          source={require('../../assets/icon/arrow-down.png')}
          style={styles.arrowIcon}
        /> */}
      </TouchableOpacity>

      {errors && <Text style={styles.errorText}>{errors}</Text>}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={handleCloseModal}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn {title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}>
                <Text>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={item => item[valueProperty].toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedId === item[valueProperty] && styles.selectedOption,
                  ]}
                  onPress={() => handleSelectOption(item)}>
                  <Text style={styles.optionText}>
                    {item[displayProperty] as string}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ShareSelect;
