import { View , Text} from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/.expo/navigation/type"

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "MainDash">
};

export function MainDash({ navigation }: Props){
    return(
        <View style={{ flex: 1, backgroundColor: "#E8E8E2", justifyContent: "center", alignItems: "center" }}>
            <Text style={{color : "red"}}>Putang ina main dashboard na</Text>
        </View>
    )
}