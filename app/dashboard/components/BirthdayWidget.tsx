'use client';

interface Customer {
  id: string;
  name: string;
  birthday: string;
}

interface BirthdayWidgetProps {
  customers: Customer[];
}

export default function BirthdayWidget({ customers }: BirthdayWidgetProps) {
  const today = new Date();
  const upcomingBirthdays = customers
    .filter(customer => customer.birthday)
    .map(customer => {
      const birthday = new Date(customer.birthday);
      const thisYear = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      const nextYear = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
      
      const nextBirthday = thisYear >= today ? thisYear : nextYear;
      const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...customer,
        nextBirthday,
        daysUntil,
        isToday: daysUntil === 0
      };
    })
    .filter(customer => customer.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (upcomingBirthdays.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🎂</span>
        <h3 className="text-xl font-semibold">Upcoming Birthdays</h3>
      </div>
      
      <div className="space-y-3">
        {upcomingBirthdays.map((customer) => (
          <div
            key={customer.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              customer.isToday ? 'bg-purple-50 border-2 border-purple-500' : 'bg-gray-50'
            }`}
          >
            <div>
              <p className="font-medium text-gray-900">{customer.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(customer.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              {customer.isToday ? (
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                  Today! 🎉
                </span>
              ) : (
                <span className="text-sm text-gray-600">
                  in {customer.daysUntil} {customer.daysUntil === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}