import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import UserLayout from "../Layouts/UserLayout";
import { Avatar } from 'primereact/avatar';


const SingleUserProfilesPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("userProfiles")
            .get(urlParams.singleUserProfilesId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"roles"] }})
            .then((res) => {
                set_entity(res || {});
                const roles = Array.isArray(res.roles)
            ? res.roles.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.roles
                ? [{ _id: res.roles._id, name: res.roles.name }]
                : [];
        setRoles(roles);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "UserProfiles", type: "error", message: error.message || "Failed get userProfiles" });
            });
    }, [props,urlParams.singleUserProfilesId]);


    const goBack = () => {
        navigate(-1, { replace: true });
    };

    return (
        <UserLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">UserProfiles</h3>
                </div>
                <p>userProfiles/{urlParams.singleUserProfilesId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">name</label><p className="m-0 ml-3" ><img id="name" src={_entity?.name} width={300}  /></p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">roles</label><p className="m-0 ml-3" >{_entity?.roles}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">roles</label>
            <p>{roles.map((elem) => (
                    <Link key={elem._id} to={`/users/${elem._id}`}>
                        <div className="card">
                            <p className="text-xl text-primary">{elem.name}</p>
                        </div>
                    </Link>
                ))}</p></div>

            <div className="col-12">&nbsp;</div>
            <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-primary">created</label>
                <p className="m-0 ml-3">{moment(_entity?.createdAt).fromNow()}</p>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-primary">updated</label>
                <p className="m-0 ml-3">{moment(_entity?.updatedAt).fromNow()}</p>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-primary">createdBy</label>
                <p className="m-0 ml-3">{_entity?.createdBy?.name}</p>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-primary">lastUpdatedBy</label>
                <p className="m-0 ml-3">{_entity?.updatedBy?.name}</p>
            </div>

                </div>
            </div>
        </div>
        
        </UserLayout>
    );
};

const mapState = (state) => {
    return {};
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
    //
});

export default connect(mapState, mapDispatch)(SingleUserProfilesPage);
