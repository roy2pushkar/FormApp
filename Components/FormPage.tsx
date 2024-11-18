import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';

// Define the type for the user details
interface UserDetails {
    uid: string;
    name: string;
    email: string;
    contacts: string;
    gender: string;
}

function UserDetailsForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contacts, setContacts] = useState('');
    const [gender, setGender] = useState('');
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]); // Correct type here
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const ref = database().ref('/users'); // Reference to users collection in Firebase

    // Fetch User Details from Realtime Database
    useEffect(() => {
        const onValueChange = ref.on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                const userList: UserDetails[] = data ? Object.keys(data).map(key => {
                    console.log("Gender for User", key, data[key].gender);  // Log the gender value
                    return {
                        uid: key,
                        name: data[key].name,
                        email: data[key].email,
                        contacts: data[key].contacts,
                        gender: data[key].gender,
                    };
                }) : [];


                setUserDetails(userList);
                console.log("User Details after Adding:", userList);


            }



        });

        return () => ref.off('value', onValueChange);
    }, []);

    // Function to add user details
    const addUserDetails = async () => {
        if (name.trim() && email.trim() && contacts.trim() && gender.trim()) {
            setIsLoading(true);

            const user = {
                name: name,
                email: email,
                contacts: contacts,
                gender: gender,
                createdAt: new Date().toISOString(),
            };

            try {
                ref.push(user);
                setName('');
                setEmail('');
                setContacts('');
                setGender('');
                setIsLoading(false);
                Alert.alert('Success', 'User details added successfully!', [{ text: 'OK' }]);

                // Re-fetch user details after adding new user
                const snapshot = await ref.once('value');
                const data = snapshot.val();
                const userList: UserDetails[] = data ? Object.keys(data).map(key => ({
                    uid: key,
                    name: data[key].name,
                    email: data[key].email,
                    contacts: data[key].contacts,
                    gender: data[key].gender,
                })) : [];
                setUserDetails(userList);
                console.log("User Details after Adding:", userList);

            } catch (error) {
                setIsLoading(false);
                console.error('Error adding user details: ', error);
                Alert.alert('Error', 'There was an issue adding user details. Please try again.', [{ text: 'OK' }]);
            }
        } else {
            Alert.alert('Validation', 'Please fill in all fields.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headingText}>User Details Form</Text>

            <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Contacts"
                value={contacts}
                onChangeText={setContacts}
            />

            {/* Gender selection with checkboxes */}
            <View style={styles.genderContainer}>
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxItem}>
                        <CheckBox
                            value={gender === 'male'}
                            onValueChange={() => setGender('male')}
                        />
                        <Text style={styles.checkboxText}>Male</Text>
                    </View>
                    <View style={styles.checkboxItem}>
                        <CheckBox
                            value={gender === 'female'}
                            onValueChange={() => setGender('female')}
                        />
                        <Text style={styles.checkboxText}>Female</Text>
                    </View>
                    <View style={styles.checkboxItem}>
                        <CheckBox
                            value={gender === 'others'}
                            onValueChange={() => setGender('others')}
                        />
                        <Text style={styles.checkboxText}>Others</Text>
                    </View>
                </View>
            </View>

            {/* Button to add user details */}
            <View style={styles.buttonContainer}>
                <Button
                    title={isLoading ? "Adding..." : "Add User Details"}
                    onPress={addUserDetails}
                    disabled={isLoading}
                />
            </View>

            {/* Display user details */}
            <View style={styles.scrollContainer}>
                {userDetails.length > 0 ? (
                    userDetails.map(({ uid, name, email, contacts, gender }) => (
                        <View key={uid} style={styles.userContainer}>
                            <Text style={styles.userText}>Uid: {uid}</Text>
                            <Text style={styles.userText}>Name: {name}</Text>
                            <Text style={styles.userText}>Email: {email}</Text>
                            <Text style={styles.userText}>Contacts: {contacts}</Text>
                            <Text style={styles.userText}>Gender: {gender}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noUsersText}>No user details available.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        padding: 16,
        //backgroundColor: '#f4f4f4',
    },
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#6200ee',
        textAlign: 'center',
    },
    textInput: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        borderRadius: 8,
        paddingHorizontal: 10,
        //backgroundColor: '#fff',
    },
    genderContainer: {
        marginBottom: 20,
    },
    genderLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6200ee',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 16,
        marginLeft: 8,
    },
    buttonContainer: {
        marginTop: 16,
        marginBottom: 20,
    },
    userContainer: {
        padding: 15,
        marginBottom: 15,
        //backgroundColor: '#FFEB3B',
        borderRadius: 10,
        borderColor: '#FF5722',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    userText: {
        fontSize: 16,
        marginBottom: 5,
    },
    noUsersText: {
        fontSize: 16,
        color: '#FF5722',
        textAlign: 'center',
        marginTop: 20,
    },
    scrollContainer: {
        marginBottom: 30,
    },
});

export default UserDetailsForm;
