import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/button/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { getAllSchools, getClassList, getTeacherList, getAcademicYearList } from "../../../api/api"; // 🔁 update path if needed
import { toast } from "react-toastify";


interface Class {
    classId: number;
    className: string;
    academicYearId: number;
    teacherId: number;
    schoolId: number;
}
interface AcademicYear {
    academicYearId: number;
    yearName: string;
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


interface Props {
    classes: Class[];
}

const headers = ['ClassId', 'ClassName', 'AcademicYear', 'homeroom teacher', 'School', 'Action'];

export default function ClassTable({ classes }: Props) {
    const navigate = useNavigate();
    const [schoolList, setSchoolList] = useState<School[]>([]);
    const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>([]);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schoolsRes, academicYearsRes, teachersRes] = await Promise.all([
                    getAllSchools({}),
                    getAcademicYearList(),
                    getTeacherList({})
                ]);
                setSchoolList(schoolsRes.data);
                setAcademicYearList(academicYearsRes.data);
                setTeacherList(teachersRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load class, school, academic year, or teacher list");
            }
        };
        fetchData();
    }, []);

    const getSchoolName = (schoolId: number) => {
        const school = schoolList.find((s) => s.schoolId === schoolId);
        return school?.schoolName || "Unknown";
    };

    const getAcademicYearName = (academicYearId: number) => {
        const year = academicYearList.find((y) => y.academicYearId === academicYearId);
        return year?.yearName || "Unknown";
    };

    const getTeacherName = (teacherId: number) => {
        const teacher = teacherList.find((t) => t.teacherId === teacherId);
        return (teacher?.firstName + ' ' + teacher?.lastName) || "Unknown";
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header}
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {classes.map((cls) => (
                            <TableRow key={cls.classId}>
                                <TableCell className="px-4 py-1 text-gray-500">{cls.classId}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">{cls.className}</TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-gray-500">
                                    {getAcademicYearName(cls.academicYearId)}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">
                                    {getTeacherName(cls.teacherId)}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">
                                    {getSchoolName(cls.schoolId)}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">
                                    <Button
                                        onClick={() => navigate(`/class/${cls.classId}`)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}



