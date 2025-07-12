import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import { getAllSchools, getStudentById, getClassList, updateStudent } from "../../../api/api";
import { useParams } from "react-router";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import PageBreadcrumbCustomize from "../../../components/common/PageBreadCrumbCustomize";

interface StudentDetails {
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
    schoolType: string;
    address: string;
    phone: string;
    email: string;
    principalId: number | null;
}

interface Class {
    classId: number;
    className: string;
}

export default function StudentDetails() {
    const { id } = useParams();
    const [schoolList, setSchoolList] = useState<School[]>([]);
    const [classList, setClassList] = useState<Class[]>([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
    const [selectedClassId, setSelectedClassId] = useState<string>("");

    const [student, setStudent] = useState<StudentDetails>({
        identityCode: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
    });

    const fetchSchoolList = async () => {
        try {
            const response = await getAllSchools({});
            setSchoolList(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchClassList = async (schoolId: number) => {
        try {
            const response = await getClassList({ schoolId });
            if (response.statusCode === 404) {
                setClassList([]);
                setSelectedClassId("");
                return;
            }
            setClassList(response.data);
        } catch (err) {
            console.error(err);
            setClassList([]);
            setSelectedClassId("");
        }
    };

    const fetchStudent = async (id: number) => {
        try {
            const response = await getStudentById(id);
            const studentData = response.data;
            setStudent(studentData);
            if (studentData.schoolId) {
                setSelectedSchoolId(studentData.schoolId.toString());
            }
            if (studentData.classId) {
                setSelectedClassId(studentData.classId.toString());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            // const response = await updateStudent(id, student);
            // if (response.status === 200) {
            //     // Handle successful update
            // }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSchoolList();
        if (id) {
            fetchStudent(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (selectedSchoolId) {
            fetchClassList(parseInt(selectedSchoolId));
        } else {
            setClassList([]);
            setSelectedClassId("");
        }
    }, [selectedSchoolId]);

    useEffect(() => {
        if (selectedClassId && !classList.find(cls => cls.classId.toString() === selectedClassId)) {
            setSelectedClassId("");
        }
    }, [classList, selectedClassId]);

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
                                <Input type="text" id="identityCode" value={student.identityCode} disabled />
                            </div>
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input type="text" id="firstName" value={student.firstName}
                                    onChange={(e) => setStudent({ ...student, firstName: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input type="text" id="lastName" value={student.lastName}
                                    onChange={(e) => setStudent({ ...student, lastName: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input type="date" id="dateOfBirth" value={student.dateOfBirth}
                                    onChange={(e) => setStudent({ ...student, dateOfBirth: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input type="text" id="phone" value={student.phone}
                                    onChange={(e) => setStudent({ ...student, phone: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input type="text" id="address" value={student.address}
                                    onChange={(e) => setStudent({ ...student, address: e.target.value })} />
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
                                    options={schoolList.map(school => ({ value: school.schoolId.toString(), label: school.schoolName }))}
                                    className="dark:bg-dark-900"
                                    onChange={(value) => setSelectedSchoolId(value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="classId">Class</Label>
                                <Select
                                    options={
                                        selectedSchoolId
                                            ? classList.map(cls => ({ value: cls.classId.toString(), label: cls.className }))
                                            : [{ value: "", label: "Please select a school" }]
                                    }
                                    className="dark:bg-dark-900"
                                    onChange={(value) => {
                                        if (selectedSchoolId) {
                                            setSelectedClassId(value);
                                        }
                                    }}
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