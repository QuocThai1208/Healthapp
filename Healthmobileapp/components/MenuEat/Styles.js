import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },

    buttonWrapper: {
        width: '75%',
    },

    diaryWrapper: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    diaryText: {
        textAlign: 'center',
        fontSize: 13,
        marginTop: 5,
    },

    menuTitleText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },

    flatListItem: {
        width: SCREEN_WIDTH,
    },

    headerDietContainer: {
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 15,
        fontWeight: '600',
    },
    cardContainer: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    cardCover: {
        height: 150,
        position: 'relative',
    },
    blurView: {
        position: 'absolute',
        bottom: 10,
        height: 40,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    blurText: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
    chipStyle: {
        alignSelf: 'flex-start',
        marginTop: 5,
        backgroundColor: '#F8F8FF',
    },

    headerRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    infoContainer: {
        backgroundColor: '#3897f1',
        borderRadius: 20,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoBox: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    pencilButton: {
        alignItems: 'center',
        marginTop: 5,
    },
    dialogWeight: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    dialogInput: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    notesTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    notesCard: {
        padding: 10,
        backgroundColor: 'white',
    },

    headerTextIngredient: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
    },
    checkboxWrapper: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 50,
        marginRight: 10,
    },
    ingredientImage: {
        width: 40,
        height: 40,
        marginRight: 20,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: 70,
        marginRight: 5,
    },
    unitText: {
        fontSize: 15,
        fontWeight: '600',
    },

    headerBox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
    },
    nutrientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    nutrientLabel: {
        width: '15%',
        fontWeight: '500',
    },
    nutrientBar: {
        width: '55%',
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    nutrientValue: {
        width: '25%',
        fontWeight: '500',
        textAlign: 'right',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    mealContainer: {
        backgroundColor: 'white',
        marginTop: 5,
        padding: 20,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mealTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealTitleText: {
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 15,
    },
    ingredientWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    ingredientUnit: {
        backgroundColor: '#F8F8FF',
        padding: 5,
        borderRadius: 10,
        textAlign: 'center',
    },
    suggestionTitle: {
        marginBottom: 10,
        fontWeight: '600',
        fontSize: 15,
    },
})