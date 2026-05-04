import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
    HiOutlineOfficeBuilding,
    HiOutlineUsers,
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp,
    HiOutlineArrowCircleRight
} from 'react-icons/hi'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ComposedChart,
    Line
} from 'recharts'
import { useDispatch } from 'react-redux'
import { setGlobalLoading } from '../redux/uiSlice'
import { fetchEmployees } from '../services/employeeService'
import { motion } from 'motion/react'
import AnalyticsCard from '../components/Admin/AnalyticsCard'

const Departments = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                dispatch(setGlobalLoading({ loading: true, title: 'Aggregating Departments', message: 'Analyzing departmental resource allocation...' }))
                const data = await fetchEmployees()
                setEmployees(data)
            } catch (error) {
                console.error("Dept Fetch Error:", error)
            } finally {
                dispatch(setGlobalLoading(false))
                setLoading(false)
            }
        }
        loadDepartments()
    }, [dispatch])

    const departmentStats = useMemo(() => {
        const stats = employees.reduce((acc, emp) => {
            const dept = emp.department || 'Unassigned'
            if (!acc[dept]) {
                acc[dept] = { name: dept, count: 0, budget: 0, highestSalary: 0 }
            }
            acc[dept].count += 1
            const salary = parseFloat(emp.base_salary || 0)
            acc[dept].budget += salary
            if (salary > acc[dept].highestSalary) acc[dept].highestSalary = salary
            return acc
        }, {})

        return Object.values(stats).map(d => ({
            ...d,
            averageSalary: d.budget / d.count
        })).sort((a, b) => b.budget - a.budget)
    }, [employees])

    const COLORS = ['#10B981', '#34D399', '#059669', '#047857', '#065F46']

    if (loading) return null

    return (
        <div className="departments-view animate-slide-up">
            {/* Top Overview Cards */}
            <Row className="g-4 mb-5">
                <Col lg={4}>
                    <AnalyticsCard
                        title="Top Budget Unit"
                        value={departmentStats[0]?.name || 'N/A'}
                        icon={<HiOutlineOfficeBuilding size={24} />}
                    />
                </Col>
                <Col lg={4}>
                    <AnalyticsCard
                        title="Most Staffed"
                        value={departmentStats.reduce((max, d) => d.count > max.count ? d : max, { count: 0 }).name}
                        icon={<HiOutlineUsers size={24} />}
                    />
                </Col>
                <Col lg={4}>
                    <AnalyticsCard
                        title="Avg. Dept Budget"
                        value={(departmentStats.reduce((sum, d) => sum + d.budget, 0) / departmentStats.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        prefix="₦"
                        icon={<HiOutlineTrendingUp size={24} />}
                    />
                </Col>
            </Row>

            {/* Department Comparison Chart */}
            <Row className="mb-5">
                <Col md={12}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-4 border border-white border-opacity-10"
                        style={{ borderRadius: '24px' }}
                    >
                        <h5 className="fw-bold text-white mb-4 ps-2">Departmental Allocation (Headcount vs Budget)</h5>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <ComposedChart data={departmentStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 11 }}
                                        tickFormatter={(val) => `₦${val / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#F8FAFC' }}
                                        itemStyle={{ color: '#F8FAFC' }}
                                        cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                                    />
                                    <Bar dataKey="budget" radius={[10, 10, 0, 0]} barSize={40}>
                                        {departmentStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                    <Line type="monotone" dataKey="count" stroke="#FBBF24" strokeWidth={3} dot={{ fill: '#FBBF24', r: 6 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </Col>
            </Row>

            {/* Department Detail Cards Grid */}
            <Row className="g-4">
                {departmentStats.map((dept, index) => (
                    <Col lg={4} md={6} key={dept.name}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-4 border border-white border-opacity-5 h-100 hover-lift active-glow"
                            style={{ borderRadius: '24px' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Badge bg="emerald" className="bg-opacity-10 text-emerald px-3 py-2 rounded-pill fw-bold border border-emerald border-opacity-20">
                                    {dept.name}
                                </Badge>
                                <div className="p-2 rounded-circle bg-white bg-opacity-5 text-slate">
                                    <HiOutlineOfficeBuilding size={20} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-white fw-extrabold mb-1">₦{dept.budget.toLocaleString()}</h2>
                                <p className="text-slate uppercase smaller tracking-widest fw-bold mb-0">Monthly Payroll Budget</p>
                            </div>

                            <div className="d-flex justify-content-between p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5 mb-4">
                                <div className="text-center flex-grow-1 border-end border-white border-opacity-10">
                                    <h5 className="mb-0 fw-bold text-black">{dept.count}</h5>
                                    <small className="text-slate uppercase smaller">Staff</small>
                                </div>
                                <div className="text-center flex-grow-1">
                                    <h5 className="mb-0 fw-bold text-black">₦{dept.averageSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h5>
                                    <small className="text-slate uppercase smaller">Avg Base</small>
                                </div>
                            </div>

                            <Button 
                                variant="link" 
                                className="w-100 text-emerald d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-bold hover-bg-emerald hover-bg-opacity-5 py-2 rounded-pill"
                                onClick={() => navigate('/staff', { state: { filter: dept.name } })}
                            >
                                View Department Staff
                                <HiOutlineArrowCircleRight size={18} />
                            </Button>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <style>
                {`
                    .active-glow:hover {
                        border-color: rgba(16, 185, 129, 0.3) !important;
                        box-shadow: 0 0 30px rgba(16, 185, 129, 0.1) !important;
                    }
                `}
            </style>
        </div>
    )
}

export default Departments
