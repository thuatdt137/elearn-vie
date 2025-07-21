import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumbCustomize from "../../../components/common/PageBreadcrumbCustomize";
import { getClassById, getAllSchools, getTeacherList, getAcademicYearList } from "../../../api/api";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

interface ClassDetail {
    classId: number;
    className: string;
    academicYearId: number;
    teacherId: number;
    schoolId: number;
}

interface School {
    schoolId: number;
    schoolName: string;
}

interface Teacher {
    teacherId: number;
    firstName: string;
    lastName: string;
}

interface AcademicYear {
    academicYearId: number;
    yearName: string;
}

export default function ClassDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [schoolList, setSchoolList] = useState<School[]>([]);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schoolsRes, teachersRes, yearsRes] = await Promise.all([
                    getAllSchools({}),
                    getTeacherList({}),
                    getAcademicYearList(),
                ]);
                setSchoolList(schoolsRes.data);
                setTeacherList(teachersRes.data);
                setAcademicYearList(yearsRes.data);
            } catch (err) {
                toast.error("Failed to load meta data");
            }

            if (id) {
                try {
                    const res = await getClassById(Number(id));
                    setClassDetail(res.data || res);
                } catch (err) {
                    toast.error("Failed to load class detail");
                }
            }
        };
        fetchData();
    }, [id]);

    return (
        <>
            <PageMeta title="Class Details" description="Details of a class" />
            <PageBreadcrumbCustomize
                items={[
                    { label: "Home", to: "/" },
                    { label: "Classes", to: "/class" },
                    { label: "Class Details" },
                ]}
            />
            <div className="max-w-xl mx-auto mt-8">
                <ComponentCard title="Class Information">
                    {classDetail ? (
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="classId">Class ID</Label>
                                <Input id="classId" type="text" value={classDetail.classId} disabled />
                            </div>
                            <div>
                                <Label htmlFor="className">Class Name</Label>
                                <Input id="className" type="text" value={classDetail.className} disabled />
                            </div>
                            <div>
                                <Label htmlFor="academicYearId">Academic Year</Label>
                                <Input id="academicYearId" type="text" value={
                                    academicYearList.find(y => y.academicYearId === classDetail.academicYearId)?.yearName || classDetail.academicYearId
                                } disabled />
                            </div>
                            <div>
                                <Label htmlFor="teacherId">Homeroom Teacher</Label>
                                <Input id="teacherId" type="text" value={
                                    teacherList.find(t => t.teacherId === classDetail.teacherId) ?
                                        teacherList.find(t => t.teacherId === classDetail.teacherId)!.firstName + ' ' +
                                        teacherList.find(t => t.teacherId === classDetail.teacherId)!.lastName :
                                        classDetail.teacherId
                                } disabled />
                            </div>
                            <div>
                                <Label htmlFor="schoolId">School</Label>
                                <Input id="schoolId" type="text" value={
                                    schoolList.find(s => s.schoolId === classDetail.schoolId)?.schoolName || classDetail.schoolId
                                } disabled />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={() => navigate("/class")}>Back to Classes</Button>
                            </div>
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </ComponentCard>
            </div>
        </>
    );
} 