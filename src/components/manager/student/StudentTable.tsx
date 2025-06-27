import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface StudentList {
    studentId: number;
    identityCode: string;
    firstName: string;
    lastName: string;
    classId: number;
    schoolId: number;
}

interface Props {
    students: StudentList[];
}

const headers = ['StudentId', 'IdentityCode', 'FullName', 'Class', 'School', 'Action'];

export default function StudentTable({ students }: Props) {
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
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {students.map((student) => (
                            <TableRow key={student.studentId}>
                                <TableCell className="px-2 py-1 text-gray-500">{student.studentId}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">{student.identityCode}</TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-gray-500">
                                    {student.firstName + ' ' + student.lastName}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">{student.classId}</TableCell>
                                <TableCell className="px-4 py-3 font-medium text-gray-800">{student.schoolId}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">Action</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
