import React, { useState, useEffect } from 'react';
import styles from './Home.module.css'
import { useDispatch } from "react-redux";
import { deleteCossignment, fetchCossignments } from "../store/action/userAppStorage";
import { Loader } from '../component/HomeLoader';
import { useNavigate } from 'react-router-dom';
import { Error } from "../component/Error";
import { useSelector } from "react-redux";
import { MdDelete, MdEdit } from 'react-icons/md';




export const AdminCossignmentsComponent = ({ status }) => {
    let [isLoading, setIsLoading] = useState(true)
    let [isError, setIsError] = useState(false)
    let [cossignmentList, setCossignmentList] = useState([])
    let [filteredCossignments, setfilteredCossignments] = useState([])

    //initialising reduzx
    let dispatch = useDispatch()
    let navigate = useNavigate()

    let { color } = useSelector(state => state.userAuth)

    useEffect(() => {
        fetchAllCossignments()
    }, [])

    let fetchAllCossignments = async () => {
        setIsError(false)
        let res = await dispatch(fetchCossignments())
        if (!res.bool) {
            setIsError(true)
            setIsLoading(false)
            return
        }
        //do some filtering here
        setCossignmentList(res.message)
        setfilteredCossignments(res.message)
        setIsLoading(false)
    }

    let editHandler = (id) => {
        //navigate to the next page
        navigate(`/cossignments/${id}`)
    }


    let deleteHandler = async (id) => {
        //delete this specific case from server
        setIsError(false)
        let res = await dispatch(deleteCossignment(id))
        if (!res.bool) {
            setIsError(true)
            setIsLoading(false)
            return
        }

        //filtering the already list

        let filteredArray = cossignmentList.filter(data => data._id !== id)

        setCossignmentList(filteredArray)
        setfilteredCossignments(filteredArray)
        setIsLoading(false)

    }

    let navigateHandler = ()=>{
        navigate('/cossignment')
    }



    let searchHandler = (e) => {
        setIsLoading(true)
        if (e) {
            const newData = filteredCossignments.filter((item) => {
                const itemData = item.courier_Reference_No ? item.courier_Reference_No : '';
                const textData = e.target.value.toLowerCase();
                return itemData.indexOf(textData) > -1;
            })
            setCossignmentList(newData)
            setIsLoading(false)
        } else {
            setCossignmentList(filteredCossignments)
            setIsLoading(false)
        }
    }


    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <Error />
    }


    return (<div className={styles.homeScreen} >

        <div className={styles.timeline} >

            <div className={styles.filter}>

                <div className={styles.searchContainer}>
                    <div className={styles.searchBar}>
                        < input className={styles.input} placeholder='search by reference no' onChange={searchHandler} />
                        <span className='material-icons'>
                            search
                        </span>

                    </div>

                </div>

                <div className={styles.dateFilter}>
                </div>


            </div>

            <div className={styles.tableContainer} >

                 <table>
  <thead>
    <tr>
      <th>REFERENCE NO</th>
      <th>SHIPPER EMAIL</th>
      <th>RECEIVER EMAIL</th>
      <th><MdDelete title="Delete" /></th>
      <th><MdEdit title="Edit" /></th>
    </tr>
  </thead>
  <tbody>
    {cossignmentList.map(data => (
      <tr key={data._id}>
        <td>{data.carrier_reference_no}</td>
        <td>{data.shipper_email}</td>
        <td>{data.receiver_email}</td>
        <td onClick={() => deleteHandler(data._id)} >
          <MdDelete title="Delete" />
        </td>
        <td onClick={() => editHandler(data._id)} >
          <MdEdit title="Edit" />
        </td>
      </tr>
    ))}
  </tbody>
</table>


            </div>

        </div>

    </div>)




}
