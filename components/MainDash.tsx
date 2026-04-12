import { View , Text} from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/.expo/navigation/type"

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "MainDash">
};

export function MainDash({ navigation }: Props){
    return(
        <View>
            <Text>Next ka na ngani</Text>
        </View>
    )
}