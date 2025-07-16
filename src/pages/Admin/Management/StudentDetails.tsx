import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumbCustomize from "../../../components/common/PageBreadcrumbCustomize";
import { getAllSchools, getStudentById, getClassList, updateStudent } from "../../../api/api";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";

interface StudentDetails {
    studentId: number;
    identityCode: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    schoolId?: number;
    classId?: number;
}

interface School {
    schoolId: number;
    schoolName: string;
}

interface Class {
    classId: number;
    className: string;
}

export default function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState<StudentDetails>({
        studentId: 0,
        identityCode: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        schoolId: 0,
        classId: 0,
    });

    const [schoolList, setSchoolList] = useState<School[]>([]);
    const [classList, setClassList] = useState<Class[]>([]);

    useEffect(() => {
        const init = async () => {
            try {
                const schoolRes = await getAllSchools({});
                setSchoolList(schoolRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load school list");
            }

            if (id) {
                try {
                    const studentRes = await getStudentById(parseInt(id));
                    const studentData = studentRes.data;
                    setStudent(studentData);

                    if (studentData.schoolId) {
                        await loadClassList(studentData.schoolId);
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to load student data");
                }
            }
        };

        init();
    }, [id]);

    const loadClassList = async (schoolId: number) => {
        try {
            const res = await getClassList({ schoolId });
            if (res.statusCode === 404) {
                setClassList([]);
            } else {
                setClassList(res.data);
            }
        } catch (err) {
            console.error(err);
            setClassList([]);
            toast.error("Failed to load class list");
        }
    };

    const handleSave = async () => {
        try {
            const studentId = parseInt(id || "-1");
            if (studentId > 0) {
                const response = await updateStudent(studentId, student);
                if (response.status === 200) {
                    toast.success("Student updated successfully");
                    navigate("/student");
                } else {
                    toast.error(response.message || "Failed to update student");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Error while updating student");
        }
    };

    const handleSchoolChange = (value: string) => {
        const newSchoolId = parseInt(value);
        setStudent((prev) => ({ ...prev, schoolId: newSchoolId, classId: undefined }));
        loadClassList(newSchoolId);
    };

    const handleChange = (field: keyof StudentDetails, value: string) => {
        setStudent((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <PageMeta title="Student Details" description="Details of a student" />
            <PageBreadcrumbCustomize
                items={[
                    { label: "Home", to: "/" },
                    { label: "Students", to: "/student" },
                    { label: "Student Details" },
                ]}
            />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="Student Information">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="identityCode">Identity Code</Label>
                                <Input id="identityCode" type="text" value={student.identityCode} disabled />
                            </div>
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={student.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={student.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={student.dateOfBirth}
                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={student.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={student.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                <div className="space-y-6">
                    <ComponentCard title="Educations Information">
                        <div className="space-y-6 flex flex-col">
                            <div>
                                <Label htmlFor="schoolId">School</Label>
                                <Select
                                    value={student.schoolId?.toString() || ""}
                                    options={schoolList.map((school) => ({
                                        value: school.schoolId.toString(),
                                        label: school.schoolName,
                                    }))}
                                    className="dark:bg-dark-900"
                                    onChange={handleSchoolChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="classId">Class</Label>
                                <Select
                                    value={student.classId?.toString() || ""}
                                    options={
                                        student.schoolId && classList.length > 0
                                            ? classList.map((cls) => ({
                                                value: cls.classId.toString(),
                                                label: cls.className,
                                            }))
                                            : [{ value: "", label: "Please select a school" }]
                                    }
                                    className="dark:bg-dark-900"
                                    onChange={(value) => handleChange("classId", value)}
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleSave}>Save</Button>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </>
    );
}
