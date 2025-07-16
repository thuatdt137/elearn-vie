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
import { getAllSchools, getClassList } from "../../../api/api"; // 🔁 update path if needed
import { toast } from "react-toastify";

interface StudentList {
    studentId: number;
    identityCode: string;
    firstName: string;
    lastName: string;
    classId: number;
    schoolId: number;
}

interface Class {
    classId: number;
    className: string;
}

interface School {
    schoolId: number;
    schoolName: string;
}

interface Props {
    students: StudentList[];
}

const headers = ['StudentId', 'IdentityCode', 'FullName', 'Class', 'School', 'Action'];

export default function StudentTable({ students }: Props) {
    const navigate = useNavigate();
    const [classList, setClassList] = useState<Class[]>([]);
    const [schoolList, setSchoolList] = useState<School[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schoolsRes, classesRes] = await Promise.all([
                    getAllSchools({}),
                    getClassList({}) // bạn cần có API này hoặc gọi từng schoolId nếu bắt buộc
                ]);
                setSchoolList(schoolsRes.data);
                setClassList(classesRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load class or school list");
            }
        };

        fetchData();
    }, []);

    const getClassName = (classId: number) => {
        const cls = classList.find((c) => c.classId === classId);
        return cls?.className || "Unknown";
    };

    const getSchoolName = (schoolId: number) => {
        const school = schoolList.find((s) => s.schoolId === schoolId);
        return school?.schoolName || "Unknown";
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
                        {students.map((student) => (
                            <TableRow key={student.studentId}>
                                <TableCell className="px-4 py-1 text-gray-500">{student.studentId}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">{student.identityCode}</TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-gray-500">
                                    {student.firstName + ' ' + student.lastName}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">
                                    {getClassName(student.classId)}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">
                                    {getSchoolName(student.schoolId)}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">
                                    <Button
                                        onClick={() => navigate(`/student/${student.studentId}`)}
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
