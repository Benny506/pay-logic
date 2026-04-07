import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { 
    HiOutlineUsers, 
    HiOutlineCurrencyDollar, 
    HiOutlineBriefcase, 
    HiOutlineChartBar, 
    HiOutlineAdjustments, 
    HiOutlineLibrary 
} from 'react-icons/hi'
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    Legend, 
    AreaChart, 
    Area 
} from 'recharts'
import { useDispatch } from 'react-redux'
import { setGlobalLoading } from '../redux/uiSlice'
import { fetchEmployees } from '../services/employeeService'
import AnalyticsCard from '../components/Admin/AnalyticsCard'
import { motion } from 'motion/react'

const Dashboard = () => {
    const dispatch = useDispatch()
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                dispatch(setGlobalLoading({ loading: true, title: 'Analyzing Dashboard', message: 'Generating real-time payroll insights...' }))
                const data = await fetchEmployees()
                setEmployees(data)
            } catch (error) {
                console.error("Dashboard Load Error:", error)
            } finally {
                dispatch(setGlobalLoading(false))
                setLoading(false)
            }
        }
        loadData()
    }, [dispatch])

    // Derived Analytics
    const stats = useMemo(() => {
        if (!employees.length) return null

        const totalSalary = employees.reduce((sum, e) => sum + parseFloat(e.base_salary || 0), 0)
        const avgSalary = totalSalary / employees.length
        
        // Department Breakdown
        const deptMap = employees.reduce((acc, e) => {
            acc[e.department] = (acc[e.department] || 0) + 1
            return acc
        }, {})

        const chartData = Object.keys(deptMap).map(name => ({
            name,
            value: deptMap[name]
        }))

        // Salary by Department
        const salaryDept = employees.reduce((acc, e) => {
            acc[e.department] = (acc[e.department] || 0) + parseFloat(e.base_salary || 0)
            return acc
        }, {})

        const salaryChartData = Object.keys(salaryDept).map(name => ({
            name,
            amount: salaryDept[name]
        }))

        return {
            totalHeadcount: employees.length,
            totalPayroll: totalSalary,
            averageSalary: avgSalary,
            departmentCount: Object.keys(deptMap).length,
            deptChart: chartData,
            salaryChart: salaryChartData
        }
    }, [employees])

    const COLORS = ['#10B981', '#34D399', '#059669', '#047857', '#065F46', '#064E3B']

    if (loading) return null

    return (
        <div className="dashboard-content animate-slide-up">
            {/* KPI Section */}
            <Row className="g-4 mb-5">
                <Col lg={3} sm={6}>
                    <AnalyticsCard 
                        title="Total Workforce"
                        value={stats?.totalHeadcount || 0}
                        icon={<HiOutlineUsers size={24} />}
                        trend="up"
                        trendValue={12}
                    />
                </Col>
                <Col lg={3} sm={6}>
                    <AnalyticsCard 
                        title="Monthly Payout"
                        value={(stats?.totalPayroll || 0).toLocaleString()}
                        prefix="$"
                        icon={<HiOutlineCurrencyDollar size={24} />}
                    />
                </Col>
                <Col lg={3} sm={6}>
                    <AnalyticsCard 
                        title="Average Salary"
                        value={(stats?.averageSalary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        prefix="$"
                        icon={<HiOutlineBriefcase size={24} />}
                    />
                </Col>
                <Col lg={3} sm={6}>
                    <AnalyticsCard 
                        title="Departments"
                        value={stats?.departmentCount || 0}
                        icon={<HiOutlineLibrary size={24} />}
                    />
                </Col>
            </Row>

            {/* Charts Section */}
            <Row className="g-4 mb-5">
                <Col lg={8}>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-4 h-100 border border-white border-opacity-10"
                        style={{ borderRadius: '24px' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold text-white mb-0">Payroll Distribution by Department</h5>
                            <HiOutlineAdjustments className="text-slate opacity-50" size={20} />
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats?.salaryChart || []}>
                                    <defs>
                                        <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
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
                                        tickFormatter={(val) => `$${val/1000}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
                                        labelStyle={{ color: '#10B981', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#F8FAFC' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#10B981" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorSalary)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </Col>
                
                <Col lg={4}>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-4 h-100 border border-white border-opacity-10"
                        style={{ borderRadius: '24px' }}
                    >
                        <h5 className="fw-bold text-white mb-4">Staff Count by Department</h5>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={stats?.deptChart || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {(stats?.deptChart || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px' }}
                                        itemStyle={{ color: '#F8FAFC' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        align="center" 
                                        iconType="circle"
                                        formatter={(value) => <span style={{ color: '#94A3B8', fontSize: '12px' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </Col>
            </Row>

            <style>
                {`
                    .dashboard-content .recharts-cartesian-grid-horizontal line {
                        stroke: rgba(255, 255, 255, 0.05);
                    }
                    .dashboard-content .recharts-tooltip-cursor {
                        fill: rgba(16, 185, 129, 0.05);
                    }
                `}
            </style>
        </div>
    )
}

export default Dashboard
