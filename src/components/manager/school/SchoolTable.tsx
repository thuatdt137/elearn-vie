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
import { getTeacherList } from "../../../api/api";
import { toast } from "react-toastify";

interface SchoolList {
    schoolId: number;
    schoolName: string;
    schoolType: string;
    principalId: number;
}

interface Teacher {
    teacherId: number;
    firstName: string;
    lastName: string;
}

interface Props {
    schools: SchoolList[];
}

const headers = ['SchoolId', 'SchoolName', 'SchoolType', 'Principal', 'Action'];

export default function SchoolTable({ schools: schools }: Props) {
    const navigate = useNavigate();
    const [principalList, setPrincipalList] = useState<Teacher[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersRes] = await Promise.all([
                    getTeacherList({})
                ]);
                setPrincipalList(teachersRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load class or school list");
            }
        };

        fetchData();
    }, []);

    const getTeacherName = (teacherId: number) => {
        console.log("getTeacherName called with teacherId:", teacherId);
        const teacher = principalList.find((s) => s.teacherId === teacherId);
        console.log("Found teacher:", teacher);
        return (teacher?.firstName + " " + teacher?.lastName) || "Unknown";
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
                        {schools.map((school) => (
                            <TableRow key={school.schoolId}>
                                <TableCell className="px-4 py-1 text-gray-500">{school.schoolId}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">{school.schoolName}</TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-gray-500">
                                    {school.schoolType}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">
                                    {getTeacherName(school.principalId)}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">
                                    <Button
                                        onClick={() => navigate(`/student/${school.schoolId}`)}
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
