'use client';

interface CustomerTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

const AVAILABLE_TAGS = [
  { name: 'VIP', color: 'bg-purple-100 text-purple-800' },
  { name: 'New', color: 'bg-blue-100 text-blue-800' },
  { name: 'Active', color: 'bg-green-100 text-green-800' },
  { name: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { name: 'Potential', color: 'bg-yellow-100 text-yellow-800' },
];

export default function CustomerTags({ tags = [], onTagsChange, disabled }: CustomerTagsProps) {
  const toggleTag = (tagName: string) => {
    if (disabled) return;
    
    if (tags.includes(tagName)) {
      onTagsChange(tags.filter(t => t !== tagName));
    } else {
      onTagsChange([...tags, tagName]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_TAGS.map((tag) => {
        const isSelected = tags.includes(tag.name);
        return (
          <button
            key={tag.name}
            type="button"
            onClick={() => toggleTag(tag.name)}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              isSelected
                ? tag.color + ' ring-2 ring-offset-1 ring-purple-500'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}