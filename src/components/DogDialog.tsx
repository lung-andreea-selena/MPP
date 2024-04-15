//dialog for adding or editing information about a dog
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button, Grid, MenuItem, TextField, Typography} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Dog, DogBreed} from '../model/Dog';
import {useDogStore} from '../store/DogStore';
import ReactHookFormSelect from './ReactHookFormSelect';
interface Inputs {
    name: string;
    breed: DogBreed;
    description: string;
    imageUrl: string;
    age: number;
    owner: string;
}
const DogDialog = () => {
    // const {opened, handleClose, addDog, selectedDog, editDog} = useDogStore();
    // const {register, handleSubmit, control, reset} = useForm<Inputs>({}); // hook is used to initialize form state and handle form submission

    // useEffect(() => {
    //     reset(selectedDog);
    // }, [selectedDog]);

    // //Depending on whether a dog is selected or not, it either adds a new dog or edits an existing one
    // const onSubmit: SubmitHandler<Inputs> = (data) => {
    //     if (selectedDog) {
    //         editDog({
    //             ...selectedDog,
    //             ...data,
    //         });
    //     } else {
    //         addDog({
    //             id: Math.floor(Math.random() * 1000),
    //             ...data,
    //         });
    //     }
    //     reset();
    //     handleClose();
    // };

    const {opened, handleClose, selectedDogId} = useDogStore();
    const {register, handleSubmit, control, reset} = useForm<Inputs>({});
    const [, setDog] = useState<Dog>();
    const [, setDogs] = useState<Dog[]>([]);

    const fetchDogs = () => {
        axios
            .get('http://localhost:3001/api/dogs')
            .then((response) => {
                const dogs = response.data.map(
                    (dog: any) =>
                        new Dog(
                            dog.id,
                            dog.name,
                            dog.breed,
                            dog.description,
                            dog.imageUrl,
                            dog.age,
                            dog.owner,
                        ),
                );
                setDogs(dogs);
            })
            .catch((error) => {
                console.error('Error fetching dogs:', error);
            });
    };
    useEffect(() => {
        fetchDogs();
    }, []);

    const fetchDogDetails = async () => {
        if (selectedDogId !== null) {
            try {
                const response = await axios.get(
                    'http://localhost:3001/api/dogs',
                );
                const dog = response.data;
                setDog(dog);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        } else {
            reset();
        }
    };
    useEffect(() => {
        fetchDogDetails();
    }, []);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (selectedDogId) {
            axios
                .put(`http://localhost:3001/api/dogs/${selectedDogId}`, data)
                .then(() => {
                    fetchDogDetails();
                    handleClose();
                    fetchDogs();
                })
                .catch((error) => {
                    console.error('Error updating dog:', error);
                });
        } else {
            axios
                .post('http://localhost:3001/api/dogs', data)
                .then(() => {
                    fetchDogDetails();
                    handleClose();
                    fetchDogs();
                })
                .catch((error) => {
                    console.error('Error adding expense:', error);
                });
        }
        handleClose();
    };

    return (
        <Dialog
            open={opened}
            onClose={handleClose}
            fullWidth
            maxWidth='sm'
            fullScreen={false}
        >
            <form style={{padding: 16}} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h5'>Add a new dog</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Name'
                            fullWidth
                            {...register('name', {required: true})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Description'
                            fullWidth
                            {...register('description', {required: true})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Image URL'
                            fullWidth
                            {...register('imageUrl', {required: true})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Age'
                            type='number'
                            fullWidth
                            {...register('age', {required: true})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Owner'
                            fullWidth
                            {...register('owner', {required: true})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ReactHookFormSelect
                            label='Breed'
                            control={control}
                            defaultValue={''}
                            name={'breed'}
                        >
                            {Object.keys(DogBreed).map((breed) => {
                                const value =
                                    DogBreed[breed as keyof typeof DogBreed];
                                return (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
                        </ReactHookFormSelect>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        display={'flex'}
                        justifyContent={'flex-end'}
                    >
                        <Button variant='contained' type='submit' sx={{mr: 2}}>
                            Submit
                        </Button>
                        <Button variant='outlined' onClick={handleClose}>
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
};

export default DogDialog;
