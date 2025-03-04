"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDailyData,
  getJudgmentDistribution,
  getOverview,
  getTagDistribution,
} from "@/service/dashboard";
import {
  IDailyDataItem,
  IJudgmentDistributionItem,
  IOverview,
  ITagDistributionItem,
} from "@/types/dashboard";
import { Clock, Mail, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 数据总览
const mockOverview = {
  efficiency: 121,
  total: 15687,
  average: 2.5,
};

// 更新每日研判数据，包含多个类型的邮件数量
const mockDailyData = [
  {
    date: "05-01",
    total: 320,
    phishing: 45,
    sensitive: 78,
    crossBorder: 120,
  },
  {
    date: "05-02",
    total: 350,
    phishing: 52,
    sensitive: 85,
    crossBorder: 132,
  },
];

// 标签分布数据
const mockTagDistribution = [
  { name: "跨境邮件", value: 400 },
  { name: "敏感内容", value: 300 },
  { name: "钓鱼邮件", value: 200 },
  { name: "正常", value: 500 },
];

// 研判结果分布数据
const mockJudgmentDistribution = [
  { name: "研判正确", value: 850, color: "#10B981" }, // 绿色
  { name: "误判", value: 150, color: "#EF4444" }, // 红色
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#22C55E"];

export function Dashboard() {
  const [overview, setOverview] = useState<IOverview>(mockOverview);
  const [dailyData, setDailyData] = useState<IDailyDataItem[]>(mockDailyData);
  const [tagDistribution, setTagDistribution] =
    useState<ITagDistributionItem[]>(mockTagDistribution);
  const [judgmentDistribution, setJudgmentDistribution] = useState<
    IJudgmentDistributionItem[]
  >(mockJudgmentDistribution);

  const fetchOverviewData = useCallback(async () => {
    const currOverview = await getOverview();
    setOverview(currOverview.data);
  }, []);
  const fetchDailyData = useCallback(async () => {
    const currDailyData = await getDailyData();
    setDailyData(currDailyData.data);
  }, []);
  const fetchTagDistribution = useCallback(async () => {
    const currTagDistribution = await getTagDistribution();
    setTagDistribution(currTagDistribution.data);
  }, []);
  const fetchJudgmentDistribution = useCallback(async () => {
    const currJudgmentDistribution = await getJudgmentDistribution();

    setJudgmentDistribution(currJudgmentDistribution.data);
  }, []);

  const fetchAllData = useCallback(async () => {
    const promises = [
      fetchOverviewData(),
      fetchDailyData(),
      fetchTagDistribution(),
      fetchJudgmentDistribution(),
    ];

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`Promise ${index + 1} succeeded with value:`, result.value);
      } else {
        console.error(`Promise ${index + 1} failed with error:`, result.reason);
      }
    });
  }, [
    fetchOverviewData,
    fetchDailyData,
    fetchTagDistribution,
    fetchJudgmentDistribution,
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 计算研判准确率
  const totalJudgments = useMemo(
    () => judgmentDistribution.reduce((acc, curr) => acc + curr.value, 0),
    [judgmentDistribution]
  );
  const accuracyRate = useMemo(
    () => ((judgmentDistribution[0].value / totalJudgments) * 100).toFixed(1),
    [judgmentDistribution, totalJudgments]
  );

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-700 text-lg font-medium">
              <Zap className="mr-2 h-4 w-4" />
              实时邮件处理速度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">
              {overview.efficiency}{" "}
              <span className="text-xl font-normal text-blue-600">封/分钟</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-green-700 text-lg font-medium">
              <Mail className="mr-2 h-4 w-4" />
              今日处理邮件总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-700">
              {overview.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              <span className="text-xl font-normal text-green-600">封</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-purple-700 text-lg font-medium">
              <Clock className="mr-2 h-4 w-4" />
              平均处理时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-700">
              {overview.average}{" "}
              <span className="text-xl font-normal text-purple-600">
                分钟/封
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 更新每日研判数据图表 */}
      <Card>
        <CardHeader>
          <CardTitle>每日邮件研判数据</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    total: "总数",
                    phishing: "钓鱼邮件",
                    sensitive: "敏感内容",
                    crossBorder: "跨境邮件",
                  };
                  return [`${value} 封`, labels[name as keyof typeof labels]];
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels = {
                    total: "每日邮件总数",
                    phishing: "钓鱼邮件总数",
                    sensitive: "敏感内容邮件总数",
                    crossBorder: "跨境邮件总数",
                  };
                  return labels[value as keyof typeof labels];
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="phishing"
                stroke="#ff0000"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="sensitive"
                stroke="#ffa500"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="crossBorder"
                stroke="#2196f3"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 其他图表保持不变 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>标签分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tagDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {tagDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>研判结果分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={judgmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}封`}
                  >
                    {judgmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{accuracyRate}%</div>
                  <div className="text-sm text-gray-500">准确率</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
