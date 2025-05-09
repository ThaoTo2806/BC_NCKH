import React, {ReactNode} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {APP_COLOR} from '../utils/constant';
const styles = StyleSheet.create({
  text: {
    textTransform: 'uppercase',
  },
  btnContainer: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    // alignSelf: 'flex-start',
    backgroundColor: APP_COLOR.PRIMARY,
  },
});

interface IProps {
  name: string;
  onPress: () => void;
  textStyles?: StyleProp<TextStyle>;
  pressStyles?: StyleProp<ViewStyle>;
  btnStyles?: StyleProp<ViewStyle>;
  icons?: ReactNode;
  loading?: boolean;
}
const ShareButton = (props: IProps) => {
  const {
    name,
    onPress,
    textStyles,
    pressStyles,
    btnStyles,
    icons,
    loading = false,
  } = props;
  return (
    <Pressable
      disabled={loading}
      style={({pressed}) => [
        {opacity: pressed || loading ? 0.5 : 1, alignSelf: 'flex-start'},
        pressStyles,
      ]}
      onPress={onPress}>
      <View style={[styles.btnContainer, btnStyles]}>
        {loading && <ActivityIndicator color={'black'} />}
        {icons ? icons : null}

        <Text style={textStyles}>{name}</Text>
      </View>
    </Pressable>
  );
};

export default ShareButton;
