import {useEffect, useState} from "react";
import type { ConfigProviderProps } from 'antd';

import "./BookTypePage.css";
import {Button} from "antd";

interface BookTypeRequest {
    bookTypeId : number;
    bookTypeName : string;
}

export interface BookTypeResponse {
    bookTypeId:number;
    bookTypeName:string;
}

interface APIResult {
    message : string;
}

type SizeType = ConfigProviderProps['componentSize'];

function BookTypePage(){

    const [size, setSize] = useState<SizeType>('small');
    const [bookTypeId,setBookTypeId] = useState<number>(0);
    const [bookTypeName,setBookTypeName] = useState("");
    const [bookTypes,setBookTypes] = useState<Array<BookTypeResponse>>([]);
    const [labelInput,setLabelInput] = useState<string>("Create Book Type");

    useEffect(() => {
        findAllBookType();
    },[]);

    async function findAllBookType(){
        let url = 'http://localhost:8080/book-type/find-all';
        const rawResponse = await fetch(url)


        const content = await rawResponse.json() as Array<BookTypeResponse>;
        setBookTypes(content)

    }

    async function onSave(){

        let request:BookTypeRequest = {
            bookTypeId : bookTypeId,
            bookTypeName : bookTypeName
        };

        let url = '';
        if(bookTypeId != null && bookTypeId > 0){
            //update
            url = 'http://localhost:8080/book-type/update-book-type';
        }else{
            //create
            url = 'http://localhost:8080/book-type/save-book-type';
        }

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        const content:APIResult = await rawResponse.json() as APIResult;
        //clear value

        resetData();
        findAllBookType();
    }

    async function onDelete(bookTypeId:number){

        const params = new URLSearchParams();
        params.append("id",bookTypeId.toString());

        let url = 'http://localhost:8080/book-type/delete-book-type?'+params.toString();
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        findAllBookType();
        //
        // console.log(bookTypeId);
    }

    function onEdit(bookType:BookTypeResponse){
        setBookTypeId(bookType.bookTypeId);
        setBookTypeName(bookType.bookTypeName);
        setLabelInput("Edit BookType");
    }

    function onChangeBookTypeName(e: any){
        let value = e.target.value;
        setBookTypeName(value);
    }


    function resetData(){
        setBookTypeId(0);
        setBookTypeName("");
        setLabelInput("Create BookType");
    }

    return <>
        <div className="custom-form">
            <div className="custom-row-form">
                <label>{labelInput} :</label>
                <input type="text"
                       value={bookTypeName}
                       onChange={ (e) => onChangeBookTypeName(e)}/>
                <button onClick={function (){
                    resetData();
                }}>reset</button>
            </div>
            <div className="custom-row-form">
                <button onClick={() => onSave()}>SAVE</button>
            </div>
        </div>

        <div className="custom-div-table">
            <table className="custom-table" border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>BookTypeName</th>
                        <th>Delete</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {bookTypes.map( (item,index) => {
                        return <tr key={item.bookTypeId}>
                                    <td>{index+1}</td>
                                    <td>{item.bookTypeName}</td>
                                    <td align="center">
                                        <Button type="primary" danger
                                                onClick={() => onDelete(item.bookTypeId)}
                                                size={size}
                                        >Delete</Button>
                                    </td>
                                    <td align="center">
                                        <Button type="primary"
                                                size={size}
                                                style={{
                                                    background : '#34bdeb',
                                                    borderColor: 'black',
                                                    color : 'white'
                                                }}
                                                onClick={() => onEdit(item)}
                                        >
                                            Edit
                                        </Button>

                                    </td>
                               </tr>;
                    })}
                </tbody>
            </table>
        </div>

    </>;
}

export default BookTypePage;
