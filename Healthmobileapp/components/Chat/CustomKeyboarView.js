import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"

const ios = Platform.OS == 'ios'
const CustomKeyboarView = ({ children, inChat }) => {
    let kavConfig = {};
    let scrollViewConfig = {};
    if (inChat) {
        kavConfig = { keyboardVerticalOffset: 90 };
        scrollViewConfig = { contentContainerStyle: { flex: 1 } };
    }
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            style={{ flex: 1 }}
            {...kavConfig}
        >
            <ScrollView style={{ flex: 1 }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                {...scrollViewConfig}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CustomKeyboarView;